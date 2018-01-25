using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class BackGround : MonoBehaviour {

	public GameObject Near;
	public GameObject Far;
	private float _timer = float.MaxValue;
	public float duration;
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		this._timer += Time.deltaTime;
		if (this._timer > this.duration) {
			StartCoroutine(this.rotateAnim(this.duration, this.Near, this.randomQuaternion() * this.Near.transform.rotation));
			StartCoroutine(this.rotateAnim(this.duration, this.Far, this.randomQuaternion() * this.Near.transform.rotation));
			this._timer = 0f;
		}
	}

	private Quaternion randomQuaternion() {
		float angle = 90f;
		if (UnityEngine.Random.Range(0f, 1f) < 0.5) {
			angle = -90f;
		}
		Vector3 axis = Vector3.up;
		float r = UnityEngine.Random.Range(0f, 1f);
		if (r < 1/3f) {
			axis = Vector3.right;
		} else if (r < 2 / 3f) {
			axis = Vector3.forward;
		}
		return Quaternion.AngleAxis(angle, axis);
	}

	private IEnumerator rotateAnim(float duration, GameObject target, Quaternion targetRotation, Action callback = null) {
		Quaternion initialRotation = target.transform.rotation;
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			target.transform.localRotation = Quaternion.Slerp(initialRotation, targetRotation, dt / duration);
			yield return null;
		}
        target.transform.localRotation = targetRotation;
        if (callback != null) {
            callback();
        }
	}
}
