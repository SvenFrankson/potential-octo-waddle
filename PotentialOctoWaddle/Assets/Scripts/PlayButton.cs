using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayButton : Button3D {


	public void OnMouseDown() {
		Debug.Log ("PlayButton Click");
		ReversoCamera.Instance.GoTo(
			0.5f,
			ReversoState.LevelSelection,
			() => {
				
			}
		);
	}
}
