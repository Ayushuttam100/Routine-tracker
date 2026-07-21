import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import LeetCodeLog from '@/models/LeetCodeLog';

async function fetchRecentSubmissions(username) {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username, limit: 100 } }),
    next: { revalidate: 0 }
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.recentAcSubmissionList;
}

async function fetchQuestionDetails(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        difficulty
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { titleSlug } }),
    next: { revalidate: 0 }
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.question;
}

export async function POST(request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Fetch recent accepted submissions
    const recentSubs = await fetchRecentSubmissions(username);
    if (!recentSubs || recentSubs.length === 0) {
      return NextResponse.json({ message: 'No recent submissions found', newCount: 0 });
    }

    // 2. Extract unique problems by titleSlug (keep the most recent timestamp)
    const uniqueProblemsMap = new Map();
    for (const sub of recentSubs) {
      if (!uniqueProblemsMap.has(sub.titleSlug)) {
        uniqueProblemsMap.set(sub.titleSlug, sub);
      }
    }
    const uniqueProblems = Array.from(uniqueProblemsMap.values());

    // 3. Check which ones already exist in MongoDB by title
    const existingLogs = await LeetCodeLog.find({ 
      title: { $in: uniqueProblems.map(p => p.title) } 
    });
    
    const existingTitles = new Set(existingLogs.map(log => log.title));
    const newProblemsToSync = uniqueProblems.filter(p => !existingTitles.has(p.title));

    if (newProblemsToSync.length === 0) {
      return NextResponse.json({ message: 'All recent problems are already synced', newCount: 0 });
    }

    // 4. Fetch details (difficulty, frontendId) for the new problems
    const logsToInsert = [];
    for (const problem of newProblemsToSync) {
      // Add a slight delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const details = await fetchQuestionDetails(problem.titleSlug);
        logsToInsert.push({
          problemId: details.questionFrontendId,
          title: problem.title,
          difficulty: details.difficulty,
          optimalApproach: 'Auto-synced from LeetCode. Add your approach here.',
          dateSolved: new Date(parseInt(problem.timestamp) * 1000)
        });
      } catch (err) {
        console.error(`Failed to fetch details for ${problem.titleSlug}:`, err);
        // Continue trying the rest even if one fails
      }
    }

    // 5. Save to MongoDB
    if (logsToInsert.length > 0) {
      const bulkOps = logsToInsert.map(log => ({
        updateOne: {
          filter: { title: log.title },
          update: { $set: log },
          upsert: true
        }
      }));
      await LeetCodeLog.bulkWrite(bulkOps);
    }

    return NextResponse.json({ 
      message: `Successfully synced ${logsToInsert.length} new problems`, 
      newCount: logsToInsert.length 
    });

  } catch (error) {
    console.error('LeetCode sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync with LeetCode' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || process.env.LEETCODE_USERNAME;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required via query param ?username= or LEETCODE_USERNAME env var' }, { status: 400 });
    }

    await connectToDatabase();

    const recentSubs = await fetchRecentSubmissions(username);
    if (!recentSubs || recentSubs.length === 0) {
      return NextResponse.json({ message: 'No recent submissions found', newCount: 0 });
    }

    const uniqueProblemsMap = new Map();
    for (const sub of recentSubs) {
      if (!uniqueProblemsMap.has(sub.titleSlug)) {
        uniqueProblemsMap.set(sub.titleSlug, sub);
      }
    }
    const uniqueProblems = Array.from(uniqueProblemsMap.values());

    const existingLogs = await LeetCodeLog.find({ 
      title: { $in: uniqueProblems.map(p => p.title) } 
    });
    
    const existingTitles = new Set(existingLogs.map(log => log.title));
    const newProblemsToSync = uniqueProblems.filter(p => !existingTitles.has(p.title));

    if (newProblemsToSync.length === 0) {
      return NextResponse.json({ message: 'All recent problems are already synced', newCount: 0 });
    }

    const logsToInsert = [];
    for (const problem of newProblemsToSync) {
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const details = await fetchQuestionDetails(problem.titleSlug);
        logsToInsert.push({
          problemId: details.questionFrontendId,
          title: problem.title,
          difficulty: details.difficulty,
          optimalApproach: 'Auto-synced from LeetCode. Add your approach here.',
          dateSolved: new Date(parseInt(problem.timestamp) * 1000)
        });
      } catch (err) {
        console.error(`Failed to fetch details for ${problem.titleSlug}:`, err);
      }
    }

    if (logsToInsert.length > 0) {
      const bulkOps = logsToInsert.map(log => ({
        updateOne: {
          filter: { title: log.title },
          update: { $set: log },
          upsert: true
        }
      }));
      await LeetCodeLog.bulkWrite(bulkOps);
    }

    return NextResponse.json({ 
      message: `Successfully synced ${logsToInsert.length} new problems`, 
      newCount: logsToInsert.length 
    });

  } catch (error) {
    console.error('LeetCode sync error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync with LeetCode' }, { status: 500 });
  }
}
