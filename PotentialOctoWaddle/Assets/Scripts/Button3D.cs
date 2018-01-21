using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Button3D : MonoBehaviour {

    public void Squish(
        float duration,
        float factor,
        Action callback = null
    ) {
        StartCoroutine(this.SquishAnim(duration, factor, callback));
    }

    public IEnumerator SquishAnim(
        float duration,
        float factor,
        Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
        float halfDuration = duration * 0.5f;
		float invHalfDuration = 1f / halfDuration;
        Vector3 initialScale = this.transform.localScale;
        Vector3 targetScale = factor * initialScale;
		while (dt < halfDuration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localScale = Vector3.Lerp(initialScale, targetScale, dt * invHalfDuration);
			yield return null;
		}
        t0 = Time.timeSinceLevelLoad;
		dt = 0f;
        while (dt < halfDuration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localScale = Vector3.Lerp(targetScale, initialScale, dt * invHalfDuration);
			yield return null;
		}
        this.transform.localScale = initialScale;
        if (callback != null) {
            callback();
        }
	}
}
