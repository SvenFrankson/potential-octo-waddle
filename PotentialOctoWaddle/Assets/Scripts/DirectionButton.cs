using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DirectionButton : Button3D {

	public ReversoState direction;

	public void OnMouseDown() {
		Debug.Log ("DirectionButton Click");
		this.Squish(
			0.15f,
			0.9f,
			() => {
				ReversoCamera.Instance.GoTo(
					0.5f,
					this.direction,
					() => {
						
					}
				);
			}
		);
	}
}
