using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RestartButton : Button3D {

	public void OnMouseDown() {
		Debug.Log ("RestartButton Click");
        this.Squish(
			0.15f,
			0.9f,
			() => {
				Level.Instance.Restart();
			}
		);
	}
}
