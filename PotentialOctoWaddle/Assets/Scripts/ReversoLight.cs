using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ReversoLight : MonoBehaviour {

	private Light _light;
	private Light light {
		get {
			if (this._light == null) {
				this._light = this.GetComponent<Light>();
			}
			return this._light;
		}
	}

	public float delay;
	public float duration;
	public Vector3[] positions;
	private int index = 0;
	private float _timer = 0f;
	private bool isMoving = false;
	
	// Update is called once per frame
	void Update () {
		if (!this.isMoving) {
			this._timer += Time.deltaTime;
			if (this._timer > this.delay) {
				this._timer = 0f;
				this.StartCoroutine(this.goToNextRoutine());
			}
		}
	}
	
	private IEnumerator goToNextRoutine() {
		this.index++;
		if (this.index >= this.positions.Length) {
			this.index = 0;
		}
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		Vector3 initialPosition = this.transform.localPosition;
		Vector3 targetPosition = this.positions[this.index];
		this.isMoving = true;
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localPosition = Vector3.Slerp(initialPosition, targetPosition, Easing.Square(dt / this.duration));
			this.light.intensity = Mathf.Abs(1f - dt / this.duration * 2) / 2f + 0.5f;
			yield return null;
		}
		this.isMoving = false;
		this.transform.localPosition = targetPosition;
		this.light.intensity = 1f;
	}
}
