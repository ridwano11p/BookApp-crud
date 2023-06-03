// Login.js
import * as React from "react";
import { Button, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const useProxy = true;

const redirectUri = AuthSession.makeRedirectUri({
  useProxy,
});

// Export the Login screen component
export default function Login({ navigation }) {
  // State variable to store the access token
  const [accessToken, setAccessToken] = React.useState("");

  // Function to request a post to get the access token from the token endpoint
  const getAccessToken = async () => {
    try {
      // Define the request parameters
      const url = "https://localhost:5001/connect/token";
      const body = new URLSearchParams();
      body.append("grant_type", "client_credentials");
      body.append("client_id", "client");
      body.append("client_secret", "secret");
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      };

      // Make the request and get the response
      const response = await fetch(url, options);
      const data = await response.json();

      // Check if the response contains an access token
      if (data && data.access_token) {
        // Set the state variable with the access token
        setAccessToken(data.access_token);
        // Navigate to the Books screen with the access token as a parameter
        navigation.navigate("Books", { accessToken: data.access_token });
      } else {
        // Throw an error if no access token is found
        throw new Error("No access token in response");
      }
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Login!" color="blue" onPress={getAccessToken} />
    </View>
  );
}
