using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RestartButton : Button3D {

	public void OnMouseDown() {
		Debug.Log ("RestartButton Click");
		Level.Instance.Restart();
	}
}
