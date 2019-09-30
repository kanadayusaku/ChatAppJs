(() => {
  'use strict';

    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyAnRFPnokTApbsKvVt7-ouXyLYoCJ5UUEc",
      authDomain: "mychatapp-5e516.firebaseapp.com",
      databaseURL: "https://mychatapp-5e516.firebaseio.com",
      projectId: "mychatapp-5e516",
      storageBucket: "mychatapp-5e516.appspot.com",
      messagingSenderId: "407035234576",
      appId: "1:407035234576:web:8c822217b8a38bc9b1fd95"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

   const db = firebase.firestore();

   //ドットインストールで書けと言われた箇所
   // db.settings({ timestampsInSnapshots: true });

  const collection = db.collection('messages');

  const auth = firebase.auth();
  //ユーザー情報の保持
  let me = null;

  const message = document.getElementById('message');
  const form = document.querySelector('form');
  const messages = document.getElementById('messages');
  const login = document.getElementById('login');
  const logout = document.getElementById('logout');

  login.addEventListener('click', () => {
    auth.signInAnonymously();
  });

  logout.addEventListener('click', () => {
    auth.signOut();
  });

  auth.onAuthStateChanged(user => {
    if(user) {
      me = user;

   while (messages.firstChild) {
     messages.removeChild(messages.firstChild);
   }

      //collectionの変更
      collection.orderBy('created').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const li = document.createElement('li');
            const d = change.doc.data();
            li.textContent = d.uid.substr(0, 8) + ': ' + d.message;
            messages.appendChild(li);
          }
        });
      }, error => {});
      console.log(`Logged in as: ${user.uid}`);
      login.classList.add('hidden');
      [logout, form, messages].forEach(el => {
        el.classList.remove('hidden');
      });
      message.focus();
      return;
    }
    me = null;
    console.log('Nobody is logged in');
    login.classList.remove('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.add('hidden');
    });
  });


  form.addEventListener('submit', e => {
    e.preventDefault();

    const val = message.value.trim();
    if (val === "") {
      return;
    }

    message.value = '';
    message.focus();

    collection.add({
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'nobody'
    })
   .then(doc => {
     console.log(`${doc.id} added!`);
   })
   .catch(error => {
     console.log('document add error!');
     console.log(error);
   });
  });
})();
