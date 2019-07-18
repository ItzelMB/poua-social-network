import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
        this.storage = app.storage();

        this.serverValue = app.database.ServerValue;
    }

    //Auth API
    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    /*doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
        url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });*/

    //User API
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    //Post API
    post = uid => this.db.ref(`posts/${uid}`);
    posts = () => this.db.ref('posts');

    storageRef = (url) => this.storage.ref(url);
}

export default Firebase;