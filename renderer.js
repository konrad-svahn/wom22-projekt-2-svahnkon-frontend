/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

(async() => {
    console.log(await window.exposed.getStuffFromMain())
    
    await window.exposed.sendStuffToMain('Stuff from renderer')
    getService()
})()

getService = async () => {
    const services = await window.exposed.getService()
    console.log(services)

    if (!services) {
        document.querySelector('#login').style.display = 'block'
        document.querySelector('#logininfo').style.display = 'block'
        document.querySelector('#logout').style.display = 'none'
        return
    }

    let list = "";
    for (const serv of services) {
        list += `
            <div class="service">
                ${serv.adres}
                <input class="btn-del" data-id="${serv._id}" type="button" value="del">
                </div>
        `;
    }
    document.querySelector('#servlist').innerHTML = list;
}

document.querySelector('#test').addEventListener('click', async () => {
    await window.exposed.test2('clicked')
    getService()
})

document.querySelector('#logout').addEventListener('click', async () => {
    await window.exposed.logout('logout')
    getService()
})

document.querySelector('#login-but').addEventListener('click', async () => {
    

    const loginFailed = await window.exposed.login({    
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    console.log(loginFailed)
    if (loginFailed) {
        document.querySelector('#msg').innerText = loginFailed.msg
        return
    }
    document.querySelector('#login').style.display = 'none'
    document.querySelector('#logininfo').style.display = 'none'
    document.querySelector('#logout').style.display = 'block'
})