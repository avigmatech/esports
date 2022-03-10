import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PlayersScreen from "./screens/PlayersScreen";
import { Header } from "../../components";
import reducers from "./store";
import Standings from "./screens/Standings";
import TeamDetails from "./screens/TeamDetails";
import Matches from "./screens/Matches";
import PlayerDetails from "./screens/PlayerDetails";
import SubstituteDetails from "./screens/SubstituteDetails";

import Home from "./screens/Home";
import SelectLeague from "./screens/SelectLeague";
import CreateTeam from "./screens/CreateTeam";
import JoinAsSubstitute from "./screens/JoinAsSubstitute";
import MatchDetails from "./screens/MatchDetails";
import RecruitingTeams from "./screens/RecruitingTeams";
import FAQs from "./screens/FAQs";
import OurSponsors from "./screens/OurSponsors";

const HomeStack = createStackNavigator();
const PlayersStack = createStackNavigator();
const StandingsStack = createStackNavigator();
const MatchesStack = createStackNavigator();
const TeamRegisterStack = createStackNavigator();
const SelectLeagueStack = createStackNavigator();

const PlayersStackNavigator = () => {
  const { Navigator, Screen } = PlayersStack;
  return (
    <Navigator
      screenOptions={{
        header: props => <Header {...props} />,
      }}>
      <Screen name="Players" component={PlayersScreen} />
      <Screen name="PlayerDetails" component={PlayerDetails} />
      <Screen name="SubstituteDetails" component={SubstituteDetails} />
    </Navigator>
  );
};

const StandingsStackNavigator = () => {
  const { Navigator, Screen } = StandingsStack;
  return (
    <Navigator
      screenOptions={{
        header: props => <Header {...props} />,
      }}>
      <Screen name="Standings" component={Standings} />
      <Screen name="TeamDetails" component={TeamDetails} />
      <Screen name="PlayerDetails" component={PlayerDetails} />
      <Screen name="MatchDetails" component={MatchDetails} />
    </Navigator>
  );
};

const MatchesStackNavigator = () => {
  const { Navigator, Screen } = MatchesStack;
  return (
    <Navigator
      screenOptions={{
        header: props => <Header {...props} />,
      }}>
      <Screen name="Matches" component={Matches} />
      {/* <Screen name="TeamDetails" component={TeamDetails} /> */}
      <Screen name="MatchDetails" component={MatchDetails} />
    </Navigator>
  );
};

// const TeamRegisterStackNavigator = () => {
//   const { Navigator, Screen } = TeamRegisterStack;
//   return (
//     <Navigator
//       >
//       <Screen
//         name="CreateTeam"
//         component={CreateTeam}
//         options={{ title: "Create a Team" }}
//       />
//       <Screen name="JoinAsSubstitute" component={JoinAsSubstitute} />
//       <Screen
//         name="RecruitingTeams"
//         component={RecruitingTeams}
//         initialParams={{ recruitingTeams: true }}
//       />
//     </Navigator>
//   );
// };

const HomeStackNavigator = () => {
  const { Navigator, Screen } = HomeStack;

  return (
    <Navigator
      screenOptions={{
        header: props => <Header {...props} />,
      }}>
      <Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Screen name="FAQs" component={FAQs} options={{ title: "FAQs" }} />
      <Screen
        name="OurSponsors"
        component={OurSponsors}
        options={{ title: "Our Sponsors" }}
      />
      <Screen
        name="SelectLeague"
        component={SelectLeague}
        options={{ title: "Select League" }}
      />
      <Screen
        name="CreateTeam"
        component={CreateTeam}
        options={{ title: "Create a Team" }}
      />
      <Screen
        name="JoinAsSubstitute"
        component={JoinAsSubstitute}
        options={{ title: "Join as substitute" }}
      />
      <Screen
        name="RecruitingTeams"
        component={RecruitingTeams}
        options={{ title: "Recruiting Teams" }}
      />
    </Navigator>
  );
};

const SelectLeagueNavigator = () => {
  const { Navigator, Screen } = SelectLeagueStack;
  return (
    <Navigator>
      <Screen
        name="SelectLeague"
        component={SelectLeague}
        options={{ headerTitle: "Select League" }} // center it
      />
    </Navigator>
  );
};

export {
  reducers,
  PlayersStackNavigator,
  StandingsStackNavigator,
  MatchesStackNavigator,
  // TeamRegisterStackNavigator,
  HomeStackNavigator,
  SelectLeagueNavigator,
};
