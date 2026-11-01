type ContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) return Response.json({ configured: false });

  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query ContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount date weekday } }
            }
          }
        }
      }`,
      variables: { username, from: from.toISOString(), to: to.toISOString() },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) return Response.json({ configured: true, error: "GitHub data is temporarily unavailable." });

  const result = await response.json();
  const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return Response.json({ configured: true, error: "No contribution calendar was returned." });

  const weeks = calendar.weeks as { contributionDays: ContributionDay[] }[];
  const days = weeks.flatMap((week) => week.contributionDays);
  const recentStart = new Date(to);
  recentStart.setMonth(recentStart.getMonth() - 3);
  const recentCount = days
    .filter((day) => new Date(day.date) >= recentStart)
    .reduce((sum, day) => sum + day.contributionCount, 0);
  const totalCount = Number(calendar.totalContributions) || 0;
  let longestStreak = 0;
  let activeStreak = 0;

  for (const day of days) {
    activeStreak = day.contributionCount > 0 ? activeStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, activeStreak);
  }

  const busiestDay = days.reduce<ContributionDay | null>(
    (busiest, day) => (!busiest || day.contributionCount > busiest.contributionCount ? day : busiest),
    null,
  );

  return Response.json({
    configured: true,
    totalContributions: totalCount,
    weeks,
    stats: {
      busiestDay: busiestDay?.date ?? "—",
      longestStreak,
      recentShare: totalCount ? Math.round((recentCount / totalCount) * 100) : 0,
    },
  });
}