function switchVisibility(a1, a2, className){
	if(!className){
		className = "d-none";
	}

	if(a1){
		if($(a1)[0].classList.contains(className) === true){
			$(a1).removeClass(className);
		}else{
			$(a1).addClass(className);
		}
	}


	if(a2){
		if($(a2)[0].classList.contains(className) === true){
			$(a2).removeClass(className);
		}else{
			$(a2).addClass(className);
		}
	}
}