using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class Button3D : MonoBehaviour {

    public Vector3 axis = Vector3.right;

	public IEnumerator Flip(
        float duration,
        Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		float invDuration = 1f / duration;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localRotation = Quaternion.AngleAxis(dt * 180f * invDuration, this.axis);
			yield return null;
		}
        this.Reset();
        if (callback != null) {
            callback();
        }
	}

    protected void Reset() {
        Debug.Log("Reset " + this.gameObject.name);
        this.transform.localRotation = Quaternion.identity;
    }
}
