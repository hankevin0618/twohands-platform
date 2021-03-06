import React, { useState } from "react";
import { authService, realtimeDB } from "../myBase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { firebaseInstance } from "../myBase";

const Auth = ({ setVerified }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("")
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "username") {
            setUserName(value)
        }
    };

    const onSocialClick = async (e) => {
        e.preventDefault()

        const { target: { dataset: { icon } } } = e;
        let provider;
        let data;

        // 나중에 provider 다 들어가서 URL 을 바꿔줘야함. 일단은 localhost로 해뒀음
        try {
            switch (icon) {
                case 'google':
                    provider = new firebaseInstance.auth.GoogleAuthProvider()
                    data = await authService.signInWithPopup(provider)
                    break;

                case 'facebook':
                    alert("Setup is not done. Need a Navig8Biz Facebook Account - Kevin")
                    // provider = new firebaseInstance.auth.FacebookAuthProvider()
                    // data = await authService.signInWithPopup(provider)
                    break;

                default:
                    break;
            }
            if (data !== null && newAccount) {
                let process = await realtimeDB.ref('users/' + authService.currentUser.uid).set({
                    email: authService.currentUser.email,
                    displayName: authService.currentUser.displayName,
                    phoneNumber: authService.currentUser.phoneNumber,

                });
                console.log(process)

            }


        } catch (error) {
            console.error(error)
            return;
        }

        console.log(data)

    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password,

                );

                authService.currentUser.updateProfile({
                    displayName: username
                })

                realtimeDB.ref('users/' + authService.currentUser.uid).set({
                    email,
                    displayName: username,
                });


            } else {
                data = await authService.signInWithEmailAndPassword(email, password);
                const checkVerification = async () => {
                    try {
                        await realtimeDB.ref('users/' + authService.currentUser.uid + '/verified').on("value", function (snapshot) {
                            setVerified(snapshot.val())
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
                checkVerification()
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <div style={{ minHeight: '100vh', backgroundImage: 'url("https://cdn.pixabay.com/photo/2019/11/07/20/48/cinema-4609877_960_720.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <div className="p-5 align-content-center" style={{ backgroundColor: '#0000008c', minHeight: '100vh', }}>
                <section className="container-fluid text-white">
                    <div className="row">
                        <div className="col-12">
                            <img className="d-block mx-auto" src="https://bizflix.navig8biz.com/wp-content/uploads/2021/07/Updated-blue-Bizflix-logo-1-1536x768-1.png" alt="bizflix-logo" width="200px" />
                        </div>
                        <div className="col-md-10 col-lg-6 d-block mx-auto">
                            <p className="text-center">BizFlix is the newest, most accessible interface in business coach streaming there is. Nowhere else can you get this level of video content at this price. Enjoy ad-free episodes, masterclasses and mini films on the go. </p>
                        </div>
                    </div>

                    <div className="row mt-5 p-3 py-5 col-md-12 col-lg-10 col-xl-9 d-flex mx-auto" style={{ backgroundColor: '#000000d6', minHeight: '460px' }}>
                        <div className="col-md-8 px-4">
                            <div className="d-block mx-auto" style={{ padding: '56.25% 0 0 0', position: 'relative' }}><iframe src="https://player.vimeo.com/video/578325341?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }} title="Free Webinar"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
                        </div>
                        <div className="col-md-4 " >
                            <h3 className="playfair-bold text-center">Member Login</h3>
                            <form id="loginForm" className="d-grid" onSubmit={onSubmit}>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={onChange}
                                />

                                {newAccount &&

                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        required
                                        value={username}
                                        onChange={onChange}
                                    />
                                }
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                />
                                <input
                                    className="main-button p-0"
                                    type="submit"
                                    value={newAccount ? "Create Account" : "Sign In"}
                                />
                                {error}
                            </form>

                            <div className="text-center">
                                <p className="mt-4">
                                    {newAccount ? "Sign Up With " : "Sign In With"}
                                </p>
                                <button className="social-button" name="google" onClick={onSocialClick}><FontAwesomeIcon name="google" icon={['fab', 'google']} size="2x" /></button>
                                <button className="social-button" name="facebook" onClick={onSocialClick}><FontAwesomeIcon icon={['fab', 'facebook']} size="2x" /></button>
                            </div>


                            <div className="d-grid mt-5">
                                <span>
                                    {newAccount ? "Already member?" : "Not a Member Yet? That's Okay!"}


                                </span>
                                <button className="mt-2" onClick={toggleAccount} style={{ backgroundColor: 'transparent', color: '#00c0ff', border: 'none', width: 'fit-content' }}>
                                    {newAccount ? "Sign In" : "Create Account"}
                                </button>

                            </div>

                        </div>


                    </div>

                </section>
            </div>
        </div>
    );
};
export default Auth;

        // 데이터베이스 쓰는방법
        // realtimeDB.ref('users/' + userId).set({
        //     email: email + "Hello",
        //     verified: verified

        // });

        // 데이터베이스 읽는방법
        // realtimeDB.ref('users/' + userId).on('value', (snapshot) => {
        //     console.log(snapshot)
        //     const data = snapshot.val();
        //     console.log(data)
        // })

        // 데이터베이스 지우는방법
        // const DeleteDB = async () => {
        //     await realtimeDB.ref('users/' + userObj.uid).remove()
        //         .then(function () {
        //             console.log("Remove succeeded.")
        //         })
        //         .catch(function (error) {
        //             console.log("Remove failed: " + error.message)
        //         });
        // }