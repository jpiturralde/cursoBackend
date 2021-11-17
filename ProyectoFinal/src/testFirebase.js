import admin from "firebase-admin"
import fs from 'fs'
import FirebaseRepository from "./persistence/FirebaseRepository.js";

console.log(process.argv.slice(2)[0])

const repoConfigPath = process.argv.slice(2)[0]

const repoConfig = JSON.parse(fs.readFileSync(repoConfigPath, 'utf8'))

console.log(repoConfig)

const repo = new FirebaseRepository(repoConfig.ProductsRepository.credential, repoConfig.ProductsRepository.collection)

let p = {
    name: "Escuadra",
    code: "CODEscuadra",
    price: 100,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    stock: 0
}
//let inserted = await repo.post(p);

//console.log(await repo.getAll())

console.log(await repo.getById('kw2v7oba5v65on9xe0y'))
await repo.deleteById('kw2vd9xjcpi14lbh6b')
console.log(await repo.getById('kw2vd9xjcpi14lbh6b'))

console.log(await repo.put('kw2v7oba5v65on9xe0y', {
    stock: 1000
}))

await repo.deleteAll()
// const serviceAccount = JSON.parse(fs.readFileSync("./config/cursobe-80baa-firebase-adminsdk-p4myf-dd7998e104.json", 'utf8'))

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const asObj = doc => ({ id: doc.id, ...doc.data() })

// console.log('Base Firebase conectada!')

// const db = admin.firestore();
// const dbUsuarios = db.collection('usuarios')
// const snapshot = await dbUsuarios.get();
// const result = []
// snapshot.forEach(doc => {
//     result.push(asObj(doc))
// })
// console.dir(result)

// const dbNombres = db.collection('nombres')

// .doc('[your ID]').set({your: "document"})
// const guardado = await dbNombres.add({id: 1, nombre: 'pepe' });
// const guardado = await dbNombres.doc('1').set({nombre: 'pepe' });
// console.log(guardado.id)

// document(mAuth.getUid()).set(user)
// const doc = await dbNombres.doc(1).get();
// const doc = await dbNombres.doc('1').get();
// console.dir(asObj(doc))

// const result = []
// const snapshot = await dbNombres.get();
// snapshot.forEach(doc => {
//     result.push(asObj(doc))
// })
// console.dir(result)

// await dbNombres.doc(guardado.id).set({ nombre: 'papa' });
// console.dir(asObj(await dbNombres.doc(guardado.id).get()))

// await dbNombres.doc(guardado.id).delete();

// //------------------------------------------------

// // version fea e ineficiente pero entendible para empezar
// try {
//     const dbColores = db.collection('colores')
//     const ids = []
//     const snapshot = await dbColores.get();
//     snapshot.forEach(doc => {
//         ids.push(doc.id)
//     })
//     const promesas = ids.map(id => dbColores.doc(id).delete())
//     const resultados = await Promise.allSettled(promesas)
//     const errores = resultados.filter(r => r.status == 'rejected')
//     if (errores.length > 0) {
//         throw new Error('no se borró todo. volver a intentarlo')
//     }
//     // const ref = firestore.collection(path)
//     // ref.onSnapshot((snapshot) => {
//     //     snapshot.docs.forEach((doc) => {
//     //         ref.doc(doc.id).delete()
//     //     })
//     // })
// } catch (error) {
//     throw new Error(`Error al borrar: ${error}`)
// }
