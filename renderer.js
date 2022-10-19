(async () => {
    document.querySelector('#service-container').style.display = 'none'
    document.querySelector('#booking-container').style.display = 'none'
    await window.exposed.sendStuffToMain('Stuff from renderer')
    getCabin()
})()

// deklarerar en global variabel här eftersom jag får error om jag gör det före fuunktionen åvan
let curentId

getCabin = async () => {
    const cabins = await window.exposed.getCabins()
    
    if (!cabins) {
        document.querySelector('#login-container').style.display = 'block'
        document.querySelector('#logininfo').style.display = 'block'
        document.querySelector('#cabin-list').style.display = 'none'
        document.querySelector('#logout').style.display = 'none'
        document.querySelector('#booking-container').style.display = 'none'
        document.querySelector('#service-container').style.display = 'none'
        return
    }
    
    let list = ''
    for (const cab of cabins) {
        list += `
            <div class="cabin">
                <p>addres: ${cab.addres}</p>
                <p>beach: ${cab.beach}</p>
                <p>sauna: ${cab.sauna}</p>
                <p>size: ${cab.size}</p> 
                
                <input class="serv-but" data-id="${cab._id}" type="button" value="services">
                </div>
        `
    }
    document.querySelector('#cabin-list').innerHTML = list;  
    
    document.querySelector('#cabin-list').style.display = 'block'
    document.querySelector('#logout').style.display = 'block'
    
    getService()
}

getService = async () => {
    document.querySelectorAll('.serv-but').forEach(item => {
        item.addEventListener('click', async () => {
            const services = await window.exposed.getService(item.getAttribute('data-id'))
            document.querySelector('#cabin-list').style.display = 'none'
            document.querySelector('#service-container').style.display = 'block'

            let list = ''
            for (const ser of services) {
                list += `
                    <div class="cabin">
                        <p>cabin being serviced: ${ser.cottage}</p>
                        <p>service name: ${ser.name}</p>
                        <p>hourly cost: ${ser.hourly_cost}</p>
                        
                        <input class="order-but" data-id="${ser.id}" type="button" value="order">
                        </div>
                `
            }
            document.querySelector('#service-list').innerHTML = list;
        
            getOrder()
        })
    })
}

getOrder = async () => {
    document.querySelectorAll('.order-but').forEach(item => {
        item.addEventListener('click', async () => {

            curentId = item.getAttribute('data-id')

            const orders = await window.exposed.getOrder(curentId)
            reloadOrders(orders)

            document.querySelector('#booking-container').style.display = 'block'
            document.querySelector('#service-container').style.display = 'none'
        })
    }) 
}

// order orders är en separat funktion från getOrder eftersom den behöver kalla på sig stjälv för att updatera sidan när en order läggs till eler tas bort
reloadOrders = async (orders) => {
    let list = ''
    for (const ord of orders) {
        var date = new Date(ord.duration)
        list += `
            <div class="cabin">
                <p>date: ${date}</p>    
                <input class="edit-but" data-id="${ord.id}" type="button" value="edit">
                <input class="delete-but" data-id="${ord.id}" type="button" value="delete">
                <div class="divide"></div>
                </div>
        `
    }
    document.querySelector('#booking-list').innerHTML = list;

    document.querySelectorAll('.delete-but').forEach(item => {
        item.addEventListener('click', async () => {
            await window.exposed.delete(item.getAttribute('data-id'))
            reloadOrders(await window.exposed.getOrder(curentId)) 
        })
    })

    document.querySelectorAll('.edit-but').forEach(item => {
        item.addEventListener('click', async () => {
            const e = await window.exposed.edit({
                order: item.getAttribute('data-id'),
                time: document.querySelector('#time').value
            })
            if (!e) {
                document.querySelector('#msg2').innerText = 'pleae enter a valid time in the date field'
                return
            }
            document.querySelector('#msg2').innerText = '' 
            reloadOrders(await window.exposed.getOrder(curentId)) 
        })
    })
}

// nedan fins event handlers för olika knapar

document.querySelector('#login').addEventListener('click', async () => {
    
    const loginFailed = await window.exposed.login({    
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    
    if (loginFailed) {
        document.querySelector('#msg').innerText = loginFailed.msg
        return
    }
    document.querySelector('#login-container').style.display = 'none'
    document.querySelector('#logininfo').style.display = 'none'
    document.querySelector('#cabin-list').style.display = 'block'
    getCabin();
})

document.querySelector('#logout').addEventListener('click', async () => {
    await window.exposed.logout('logout')
    getCabin()
})

document.querySelector('#create').addEventListener('click', async () => {
    const time = document.querySelector('#time').value
    const created = await window.exposed.create(time)
    if  (!created) {
        document.querySelector('#msg2').innerText = 'pleae enter a valid time in the date field'
        return
    }
    document.querySelector('#msg2').innerText = ''
    reloadOrders(await window.exposed.getOrder(curentId))
})

document.querySelector('#back1').addEventListener('click', async () => {
    document.querySelector('#cabin-list').style.display = 'block'
    document.querySelector('#service-container').style.display = 'none'
})

document.querySelector('#back2').addEventListener('click', async () => {
    document.querySelector('#booking-container').style.display = 'none'
    document.querySelector('#service-container').style.display = 'block'
    document.querySelector('#msg2').innerText = ''
})