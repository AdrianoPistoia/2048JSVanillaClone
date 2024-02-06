class loginManager {
    user=""
    pass=""
    entry="false"
    constructor(){
        this.armarLoginModal();
        if(!this.entry){
            // checkLoginCred();
        } 
    }
    armarLoginModal(){
        let sombra, mBody, form, divInputs, iUser, lblUser, 
        iPass, lblPass, divBotones, btnSubmit, btnReg;
        sombra      = construirElemento("div",{class:"mlShadow",id:"sombra"}),
            mBody       = construirElemento("div",{class:"mlBody",id:"mlBody"});
                form        = construirElemento("form",{method:"POST",action:"#",class:"mlForm"})
                // divInputs   = construirElemento("div",{}) 
                    lblUser     = construirElemento("label",{class:"lblInput",for:"iUser"},"Ingrese su usuario:")
                    iUser       = construirElemento("input",{class:"mlInput",type:"text",id:"iUser",placeholder:"Usuario"})
                    
                    lblPass     = construirElemento("label",{class:"lblInput",for:"iPass"},"Ingrese su contraseña:")
                    iPass       = construirElemento("input",{class:"mlInput",type:"pass",id:"iPass",placeholder:"Contraseña"})
                //
                divBotones  = construirElemento("div",{id:"mlBtnBar"});
                    btnSubmit   = construirElemento("input",{type:"button",value:"Iniciar Sesión"}) 
                    btnSubmit.addEventListener("click",function(){

                    })
                    btnReg      = construirElemento("input",{type:"button",value:"Registrarse"}) 
                    btnReg.addEventListener("click",function(){
                        
                    })
                //divBotones
            //mBody
        //sombra
        document.body.appendChild(sombra);
            sombra.appendChild(mBody)
                mBody.appendChild(form)
                    form.appendChild(lblUser)
                    form.appendChild(iUser)
                    form.appendChild(lblPass)
                    form.appendChild(iPass)
                //
                mBody.appendChild(divBotones)
                divBotones.appendChild(btnSubmit)
                divBotones.appendChild(btnReg)
            //
        //
    }
}
