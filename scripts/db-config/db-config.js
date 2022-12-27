import { initializeApp } from '../firebase/firebase-app.js'
import { getDatabase } from '../firebase/firebase-database.js'

const firebaseConfig = {
  apiKey: 'AIzaSyC811qBMj7wxKNPg3w5dGjQcRHkyjPFK1k',
  authDomain: 'db-4-lab.firebaseapp.com',
  projectId: 'db-4-lab',
  storageBucket: 'db-4-lab.appspot.com',
  messagingSenderId: '107575273657',
  appId: '1:107575273657:web:7cf39a8432a7c3d08f1368',
  measurementId: 'G-DWTKB8S1JW',
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export { db }
