const { Octokit } = require('@octokit/rest');
const core = require('@actions/core');

async function run() {
  try {
    // Initialize Octokit with the GitHub token
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Parse GitHub context from environment variables
    const eventPath = process.env.GITHUB_EVENT_PATH;
    const event = require(eventPath);
    const pullRequest = event.pull_request;
    
    if (!pullRequest) {
      console.log('No pull request found in context. Exiting.');
      return;
    }
    
    const prNumber = pullRequest.number;
    const owner = event.repository.owner.login;
    const repo = event.repository.name;
    
    console.log(`Processing PR #${prNumber} in ${owner}/${repo}`);
    
    // Get the latest pull request data to check status
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    });
    
    // Check if the PR is mergeable
    if (pr.mergeable === false) {
      console.log(`PR #${prNumber} is not mergeable. It may have conflicts.`);
      return;
    }
    
    // Get the status of required checks
    const { data: checks } = await octokit.checks.listForRef({
      owner,
      repo,
      ref: pr.head.sha
    });
    
    // Check if any required check failed
    const failedChecks = checks.check_runs.filter(check => 
      check.conclusion !== 'success' && 
      check.conclusion !== 'skipped' &&
      check.conclusion !== null
    );
    
    if (failedChecks.length > 0) {
      console.log(`PR #${prNumber} has failed checks: ${failedChecks.map(c => c.name).join(', ')}`);
      return;
    }
    
    console.log(`All checks passed for PR #${prNumber}, enabling auto-merge`);
    
    // Try to update branch only if needed (will safely skip if not applicable)
    try {
      console.log(`Attempting to update branch for PR #${prNumber}...`);
      await octokit.pulls.updateBranch({
        owner,
        repo,
        pull_number: prNumber
      });
      console.log(`Successfully updated branch for PR #${prNumber}`);
    } catch (updateError) {
      // If update fails because there are no new commits, that's fine - continue with merge
      if (updateError.status === 422) {
        console.log(`No new commits to update for PR #${prNumber}, continuing with merge`);
      } else {
        // For other errors, we should still log but continue with the merge attempt
        console.log(`Warning: Could not update branch for PR #${prNumber}: ${updateError.message}`);
      }
    }
    
    // Merge the PR
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      merge_method: 'merge',
      commit_title: `${pr.title} (#${prNumber})`,
      commit_message: pr.body || ''
    });
    
    console.log(`Successfully merged PR #${prNumber}`);
  } catch (error) {
    console.error(`Error auto-merging PR:`, error);
    process.exit(1);
  }
}

run();
