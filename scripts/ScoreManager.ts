class ScoreManager {

    public static getScore(level: number): number {
        let score = localStorage.getItem("score-level-" + level);
        if (score) {
            let scoreValue = parseInt(score);
            if (isFinite(scoreValue)) {
                return scoreValue;
            }
        }
        return 0;
    }

    public static setScore(level: number, score: number): void {
        let currentScore = ScoreManager.getScore(level);
        if (isFinite(score) && score > currentScore) {
            localStorage.setItem("score-level-" + level, score.toFixed());
        }
    }
}