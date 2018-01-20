using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackButton : Button3D {

	public void OnMouseDown() {
		Debug.Log ("BackButton Click");
		ReversoCamera.Instance.GoTo(
			0.5f,
			ReversoState.MainMenu,
			() => {
				
			}
		);
	}
}
