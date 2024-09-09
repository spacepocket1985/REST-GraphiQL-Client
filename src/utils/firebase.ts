import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  DocumentData,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: 'AIzaSyBMboYU_6CoJR4clhix5BrV83gVQm-P2rk',
  authDomain: 'rest-graphiql-client-d5f45.firebaseapp.com',
  projectId: 'rest-graphiql-client-d5f45',
  storageBucket: 'rest-graphiql-client-d5f45.appspot.com',
  messagingSenderId: '619410869822',
  appId: '1:619410869822:web:3f68b8702ded98399c8b6f',
  measurementId: 'G-3PSTFV8W63',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = res;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const useUser = () => {
  const [user] = useAuthState(auth);
  return user;
};

const fetchUserName = async (
  user: User
): Promise<DocumentData[string] | undefined> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    return data.name;
  } catch (err) {
    if (err instanceof Error)
      alert('An error occured while fetching user data');
  }
};

const onError = (error: string): void => {
  toast.error(error, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  useUser,
  fetchUserName,
  onError,
};
