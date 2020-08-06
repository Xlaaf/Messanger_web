import React, { useState, useEffect, forwardRef } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import "./App.css";
import Message from "./Message";
import { db, auth, storage } from "./firebase";
import firebase from "firebase";
import FlipMove from "react-flip-move";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import Modal from "@material-ui/core/Modal";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  //states
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const classes = useStyles();
  //fetching user details
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser) {
        console.log(authuser);
        setUser(authuser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);
  //fetching messages
  useEffect(() => {
    db.collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, m: doc.data() }))
        );
      });
  }, []);
  //imageuploading function
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  //message sending function
  const sendMessage = (event) => {
    event.preventDefault();
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          //error handler
          alert(error.message);
        },
        () => {
          // Complete function
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("messages").add({
                message: input,
                Username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                imageUrl: url,
              });

              setProgress(0);
              setInput("");
              setImage(null);
            });
        }
      );
    } else {
      db.collection("messages").add({
        message: input,
        Username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl: null,
      });
      setInput("");
    }
  };
  // signup handler
  const handleSignup = (event) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  //signin handler
  const handleSignin = (event) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((e) => alert(e.message));
    setOpenSignin(false);
  };
  return (
    <div className="App">
      <div className="heading">
        <h2
          style={{
            textAlign: "left",
            paddingLeft: "20px",
            paddingTop: "10px",
            paddingBottom: "5px",
            fontFamily: "Cursive",
          }}
        >
          🍍 Hey Chats
        </h2>

        {/* rendering signup logout and signin buttons */}

        {user ? (
          <Button
            className="app__signup"
            type="button"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              className="app__signup"
              type="button"
              onClick={() => setOpen(true)}
            >
              Sign up
            </Button>
            <Button type="button" onClick={() => setOpenSignin(true)}>
              Login
            </Button>
          </>
        )}
      </div>

      {/* rendering messages component */}
      {user ? (
        <>
          <FlipMove>
            {messages.map(({ id, m }) => (
              <Message key={id} username={user.displayName} text={m} />
            ))}
          </FlipMove>

          {/* code for sending messages */}
          <form className="message_form">
            <FormControl className="app__formControl">
              <Input
                className="app__input"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <label className="app__imageButton" htmlFor="file-upload">
                <ImageIcon />
              </label>

              <Input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleChange}
              />

              <IconButton
                className="app__iconButton"
                disabled={!input && !image}
                variant="contained"
                color="primary"
                type="submit"
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
            </FormControl>
          </form>
        </>
      ) : (
        <h3>You need to login first</h3>
      )}

      {/* modal for login */}
      <Modal
        open={openSignin}
        onClose={() => {
          setOpenSignin(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__form">
              <center
                style={{
                  marginBottom: "10px",
                }}
              >
                🍍Hey Chats
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" onClick={handleSignin}>
                LOGIN
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      {/* modal for signup */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__form">
              <center
                style={{
                  marginBottom: "10px",
                }}
              >
                🍍Hey Chats
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={handleSignup}>
                LOGIN
              </Button>
            </center>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default App;
