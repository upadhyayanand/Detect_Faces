import React, { Component } from "react";
import Navigation from "./Navigation/Navigation";
import Signin from "./Signin/Signin";
import Register from "./Register/Register";
import Logo from "./Logo/Logo";
import ImageLinkForm from "./ImageLinkForm/ImageLinkForm";
import Rank from "./Rank/Rank";
import RankUpdate from "./Rank/RankUpdate";
import "./App.css"; // Corrected import statement
import { detectFaces } from "./Devops_Flask/httpReq";
// Moved initialState outside the class for better modularity jkdnkd
const initialState = {
  input: "",
  imageUrl: "",
  detectedFaceUrl: "",
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = async () => {
    try {
      console.log("Input value:", this.state.input);
      const detectedFaceUrl = await detectFaces(this.state.input);
      console.log("Detected face URL:", detectedFaceUrl);
      this.setState({ detectedFaceUrl });
      if (detectedFaceUrl) {
        RankUpdate(this.state.user.id);
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  componentDidMount() {
    fetch("http://localhost:3004/")
      .then((response) => response.json())
      .then(console.log);
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, route, user, detectedFaceUrl } = this.state;
    return (
      <div className="App">
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />

            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            {detectedFaceUrl && (
              <div style={{ marginLeft: "1%" }}>
                <h2>Detected Faces:</h2>
                <img
                  src={detectedFaceUrl}
                  alt="Detected Faces"
                  height="350px"
                  width="600px"
                />
              </div>
            )}
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
