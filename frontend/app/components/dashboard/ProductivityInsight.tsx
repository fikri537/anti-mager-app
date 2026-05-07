import Card from "../ui/Card";

type Props = {
  completionRate: number;
  score: number;
};

export default function ProductivityInsight({
  completionRate,
  score,
}: Props) {
  const getInsight = () => {
    if (completionRate >= 80) {
      return {
        title:
          "Excellent productivity",
        desc:
          "You are consistently finishing tasks with strong momentum.",
      };
    }

    if (completionRate >= 50) {
      return {
        title:
          "Good progress",
        desc:
          "You're building consistency. Keep pushing forward.",
      };
    }

    return {
      title:
        "Need improvement",
      desc:
        "Focus on completing pending tasks to improve momentum.",
    };
  };

  const insight = getInsight();

  return (
    <Card>
      <p className="text-sm text-white/40">
        AI Productivity Insight
      </p>

      <h2 className="mt-4 text-3xl font-black">
        {insight.title}
      </h2>

      <p className="mt-4 max-w-lg text-white/50 leading-relaxed">
        {insight.desc}
      </p>

      <div className="mt-8 flex gap-6">
        <div>
          <p className="text-sm text-white/40">
            Completion Rate
          </p>

          <h3 className="mt-2 text-2xl font-black text-cyan-400">
            {completionRate}%
          </h3>
        </div>

        <div>
          <p className="text-sm text-white/40">
            Productivity Score
          </p>

          <h3 className="mt-2 text-2xl font-black text-violet-400">
            {score}
          </h3>
        </div>
      </div>
    </Card>
  );
}