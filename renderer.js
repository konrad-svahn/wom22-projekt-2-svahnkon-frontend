/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
(async () => {
    console.log(await window.exposed.getStuffFromMain())
    
    await window.exposed.sendStuffToMain('Stuff from renderer')
    getCabin()
})()

getCabin = async () => {
    const cabins = await window.exposed.getCabins()
    console.log(cabins)

    if (!cabins) {
        document.querySelector('#login').style.display = 'block'
        document.querySelector('#logininfo').style.display = 'block'
        document.querySelector('#cabin-list').style.display = 'block'
        document.querySelector('#logout').style.display = 'none'
        document.querySelector('#booking-container').style.display = 'none'
        return
    }

    let list = "";
    for (const cab of cabins) {
        //cabinsArr.push(cab._id)
        list += `
            <div class="cabin">
                <p>addres: ${cab.addres}</p>
                <p>beach: ${cab.beach}</p>
                <p>sauna: ${cab.sauna}</p>
                <p>size: ${cab.size}</p> 
                
                <input class="serv-but" data-id="${cab._id}" type="button" value="services">
                </div>
        `;
    }
    document.querySelector('#cabin-list').innerHTML = list;  

    document.querySelectorAll('.serv-but').forEach(item => {
        item.addEventListener('click', async () => {
            const s = await window.exposed.getService(item.getAttribute('data-id'))
            console.log(s)
            getService(s)
        })
    })
}

getService = async (services) => {
    document.querySelector('#cabin-list').style.display = 'none'
    let list = "";
    for (const ser of services) {
        //cabinsArr.push(cab._id)
        list += `
            <div class="cabin">
                <p>cabin being serviced: ${ser.cottage}</p>
                <p>service name: ${ser.name}</p>
                <p>hourly cost: ${ser.hourly_cost}</p>
                
                <input class="order-but" data-id="${ser.id}" type="button" value="order">
                </div>
        `;
    }
    document.querySelector('#service-list').innerHTML = list;

    document.querySelectorAll('.order-but').forEach(item => {
        item.addEventListener('click', async () => {
            const o = await window.exposed.getOrder(item.getAttribute('data-id'))
            console.log(o)
            
        })
    })
}



document.querySelector('#test').addEventListener('click', async () => {
    await window.exposed.test2('clicked')
    getCabin()
})

document.querySelector('#create').addEventListener('click', async () => {
    const time = document.querySelector('time').value
    await window.exposed.create('create')
    console.log(time)
})

document.querySelector('#logout').addEventListener('click', async () => {
    await window.exposed.logout('logout')
    getCabin()
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