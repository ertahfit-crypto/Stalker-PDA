# S.T.A.L.K.E.R. Zone Terminal

## Atmospheric Web Application

A fully immersive web application that recreates the atmosphere of the S.T.A.L.K.E.R. game series with a complete authentication system, real-time chat, anomaly reports, and profile management.

## Features

### Authentication System
- **PDA-styled login/registration interface** with retro terminal aesthetics
- **User persistence** using localStorage
- **Glitch effects** and radiation indicators
- **Callsign-based** user identification

### Main Interface
- **HUD elements**: Radiation meter, health bar, artifact counter, zone time
- **Navigation system** with glitch effects and hover states
- **Profile management** with customizable avatars and skill levels
- **Atmospheric design** with noise overlay and post-apocalyptic styling

### Chat System
- **Real-time messaging** with timestamp and user levels
- **Voice message simulation** 
- **Message deletion** for own messages
- **Auto-generated responses** from AI stalkers
- **Level-based color coding** (Newcomer/Gray, Stalker/Green, Veteran/Amber)

### Anomaly Reports
- **Create and manage** anomaly reports
- **Image support** with fallback to generated placeholders
- **Author attribution** with timestamps
- **Delete own reports** functionality
- **Grid layout** with responsive design

### Zone Map
- **Interactive locations** (Cordon, Garbage, Agroprom, Pripyat)
- **Danger zones** highlighted in red
- **Click interactions** with location feedback

### Traders Section
- **Character profiles** for major traders
- **Immersive descriptions** and styling

## Technical Implementation

### Frontend Architecture
- **HTML5 semantic structure** with accessibility in mind
- **CSS3 animations** and effects for atmosphere
- **Vanilla JavaScript** for maximum compatibility
- **LocalStorage API** for data persistence
- **Responsive design** for mobile devices

### Design System
- **Color palette**: Radiation greens, ambers, blood reds, metallic grays
- **Typography**: VT323 and Share Tech Mono for terminal feel
- **Effects**: Static noise, glitch animations, radiation pulses
- **HUD elements**: Real-time meters and indicators

### Data Management
- **User accounts** stored in localStorage
- **Message history** with timestamps
- **Anomaly reports** with metadata
- **Profile customization** with levels and descriptions

## Installation & Usage

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Register a new account or login with existing credentials
4. Explore the Zone through the terminal interface

## File Structure

```
S.T.A.L.K.E.R-Zone-Terminal/
|-- index.html          # Main HTML structure
|-- styles.css          # Complete styling with animations
|-- script.js           # All JavaScript functionality
|-- README.md           # This documentation
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile browsers**: Responsive design included

## Atmospheric Elements

### Visual Effects
- **Static noise overlay** with animation
- **Glitch effects** on buttons and inputs
- **Radiation pulse** animations
- **Terminal flicker** effects
- **Hover states** with glow effects

### Audio/Visual Feedback
- **Error messages** with glitch animations
- **Success states** with color transitions
- **Loading states** with pulse effects
- **Interactive feedback** on all elements

### Immersion Details
- **PDA terminal** aesthetic throughout
- **Zone time** display in real-time
- **Radiation level** fluctuations
- **Artifact counter** updates
- **Connection status** indicators

## User Experience Features

### Navigation
- **Section switching** with smooth transitions
- **Active state indicators**
- **Mobile-responsive** navigation
- **Keyboard shortcuts** (Enter to submit)

### Profile System
- **Three skill levels**: Newcomer, Stalker, Veteran
- **Color-coded usernames** based on level
- **Customizable descriptions**
- **Avatar management**

### Chat Features
- **Message timestamps**
- **Auto-scroll** to latest messages
- **Voice message simulation**
- **Delete own messages**
- **AI stalker responses** for immersion

## Development Notes

The application uses modern web technologies while maintaining compatibility with older browsers. All data is stored locally in the browser, making it privacy-focused and requiring no server infrastructure.

The atmospheric design creates an authentic S.T.A.L.K.E.R. experience with careful attention to detail in animations, color schemes, and interactive elements that respond to user actions with appropriate visual feedback.
