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

    public static ClearScore(): void {
        for (let i = 1; i <= 16; i++) {
            localStorage.setItem("score-level-" + i, "0");
        }
    }
}