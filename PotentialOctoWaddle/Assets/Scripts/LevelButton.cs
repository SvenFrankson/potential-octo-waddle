using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelButton : Button3D {
	public int index;

	public void OnMouseDown() {
		Debug.Log ("LevelButton Click");
		ReversoCamera.Instance.GoTo(
			0.5f,
			ReversoState.Play,
			() => {
				
			}
		);
	}
}
