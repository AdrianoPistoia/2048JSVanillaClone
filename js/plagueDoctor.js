class PlagueDoctor {
	target = "";
	constructor(id, title) {
		if (!document.querySelector(".operationTable")) {
			let operationTable = document.createElement("div");
			operationTable.setAttribute("class", "operationTable")
			document.body.appendChild(operationTable);
		}
		let chatWindow = document.createElement("div");
		chatWindow.setAttribute("id", id);
		chatWindow.setAttribute("class", "crowChat");
		document.querySelector(".operationTable").appendChild(chatWindow);
		this.target = document.getElementById(id);
		this.addTitle(title, document.getElementById(id));
	}
	addTitle(title, target) {
		let h2 = document.createElement("h2");
		h2.textContent = title;
		target.appendChild(h2);
	};
	addMensaje(mensaje, object) {
		let p = document.createElement("p");
		let hr = "</hr>";
		let br = "</br>";
		let iter = 0;
		p.innerHTML = `[${_MessageCounter++}]: ` + mensaje + br;

		if (typeof object === "object" && object.length > 1) {
			object.forEach(obj => {
				p.innerHTML += JSON.stringify(obj) + br;
				iter++;
			})
			this.target.appendChild(p);
		} else if (typeof object === "object") {
			p.innerHTML += JSON.stringify(object) + hr;
			this.target.appendChild(p);
		} else {
			p.innerHTML += object + hr;
			this.target.appendChild(p);
		}
	}
}