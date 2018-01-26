public class Easing {

    public static float Square(float x) {
        if (x <= 0.5f) {
            return 2f * x * x;
        }
        else {
            return 1f - 2f * (1f - x) * (1f - x);
        }
    }
}