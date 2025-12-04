# ZAMO Chat App

### Description

Zamo is a cutting-edge application crafted for today's dynamic individuals and teams. Designed with modernity in mind, Zamo offers a comprehensive solution for real-time communication and collaboration. Whether it's chat or video calls, our platform ensures seamless interaction among users. Share information, exchange resources, and spark discussions with ease. Zamo is more than just an app. It's a partner in fostering meaningful connections and collaborative success.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000?logo=vercel)](https://zamo-chat-app.vercel.app)

### Creators

- Andrey Raychev - [@Andrey-Raychev](https://github.com/Andrey-Raychev)
- Martin Andreev - [@Martin-Andreev-288](https://github.com/Martin-Andreev-288)
- Zvezda Neycheva - [@DreamersJS](https://github.com/DreamersJS)
- Special thanks to testers who helped surface UX gaps and connectivity issues.

### Technologies used

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/WebRTC-333333?logo=webrtc&logoColor=white"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white"/>
</p>

### Installation

```
npm install
```

### Run the application

```
# Development
npm start

# Production build
npm run build
npm run preview
```

### Usage

- **Public Interface: Where Engagement Begins**
<br/>Users enjoy a visually appealing welcome page that guides them smoothly. Each user could choose 'Login' or 'Create an account' to get started its way. The simple and efficient Login page ensures users securely access their accounts and new users navigate an intuitive registration process.

<img src="./public/assets/images/scrwelcomepage.png"/>
<br/>
<br/>
<img src="./public/assets/images/scrlogin.png"/>
<br/>

- **Profile Panels: Personalizing Communication for Users**
  <br />Users have a profile panel which enables them to edit their Name, Email and Location. Users can also change their avatar and status.

 <img src="./public/assets/images/scrprofilepage.png"/>
 <br />

- **Chat Interface: Where Conversations Flourish**
  <br />Zamo's chat interface provides users with a dynamic space for direct messaging with friends. Users can easily search for contacts, start one-on-one conversations, and utilize audio and video features. Adding reactions to messages adds expressiveness, while the ability to edit or delete messages gives users control over their communication.

<img src="./public/assets/images/scrchat.png"/>

![GIF](public/assets/images/scrsendpic.gif)
<br/>

- **Groups: Cultivating Collaborative Communities**
  <br />Zamo enables users to build stronger connections by creating and managing their own groups. During setup, users can add participants exclusively from their friend list, tailoring groups to specific interests or topics. Users have full control over their groups, with the ability to delete or leave them as needed, ensuring participation aligns with preferences and needs, creating a dynamic community environment.

<img src="./public/assets/images/scrgroups.png"/>
<br/>

- **Channels: Enriching Group Conversations**
  <br/>Upon the creation of a group in Zamo, a default #General channel is automatically established, serving as the foundational space for group discussions. However, the platform goes beyond this by empowering users with the capability to create additional channels within each group.
  <br/>The channels operate similarly to direct chats but are distinct in their facilitation of group conversations, allowing multiple users to engage with each other simultaneously. This feature is ideal for organizing discussions around specific topics, projects, or interests within the larger group context. Users who create channels retain the authority to delete them.

<img src="./public/assets/images/scrchannels.png"/>
<br/>

- **Contacts: Your Hub for Connections**
  <br/>The Contacts page in Zamo acts as a central hub for managing and expanding your friend network. It features a comprehensive list of current friends with an easy-to-use search function. Adding friends directly from this page streamlines the process, making your network easily accessible. Incoming friend requests are prominently displayed, simplifying the process of welcoming new connections into your circle.

<img src="./public/assets/images/scrcontacts.png"/>
<br/>

- **Video calls: Real-Time Conversations Beyond Text**
  <br/>For moments when typing just isn’t enough, Zamo empowers users with instant video calling powered by WebRTC and Firebase signaling. When initiating a call, the recipient is immediately notified—ensuring real-time, face-to-face communication without delays. 

![GIF](public/assets/images/video.gif)
<br/>

### Known Issues & Lessons Learned

1. **Routing on Vercel**
   - **Issue:** Initial deployment returned `NOT_FOUND` when refreshing routes.
   - **Fix:** Added `vercel.json` rewrite to serve `index.html` for all paths.
   - **Lesson:** Single Page Applications require explicit route handling in production.

2. **Message Notifications**
   - **Issue:** Testers noted that incoming messages were easy to miss (no visual indicators).
   - **Next Step:** Plan to add unread counters and “new message” badges for better UX.
   - **Lesson:** Testing with no dev people(or people who did not work on this project) reveals hidden UX gaps.

3. **Mobile WebRTC Alerts**
   - **Issue:** Rare alerts appeared on mobile after granting camera/mic access, before the stream rendered.
   - **Status:** Intermittent, not consistently reproducible.
   - **Lesson:** Mobile browsers handle permissions and track negotiation differently. Needs further investigation.

4. **WebRTC and varying NAT/firewall restrictions**
   - **Issue:** Video calls didn't work for one of the testers.
   - **Cause:** The reason it fails is network-dependent.
   - **Next Step:** Gather more testers on different networks.
   - **Fix:** Added TURN server

### Test Accounts:

- User 1:
  - email: andrei.27@abv.bg
  - pass: 123456
- User 2:
  - email: Alex95@abv.bg
  - pass: 123456
- User 3:
  - email: Ivo22@abv.bg
  - pass: 123456
