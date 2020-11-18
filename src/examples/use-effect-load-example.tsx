import React, { useEffect } from "react";
import { AppViewState } from "../helper-types";
import { BaseBehavior, useBehavior } from "..";
import { boundMethod } from "autobind-decorator";
import axios from 'axios';
import { useMount } from "react-use";

class LocalState extends AppViewState {
  public pokemonName: string = "";
}

class LocalBehavior extends BaseBehavior<any> {
  @boundMethod
  public async loadDataForComponent() {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/blaziken');
    const pokemonData = response.data;
    const name = pokemonData.name
    this.setter('pokemonName', name);
  }
}

export const PrintTheCoolestPokemon = (props: object) => {
  const b = useBehavior(props, LocalBehavior, new LocalState());
  // useMount to run once
  // useMount(() => b.loadDataForComponent())
  // Or just write the useEffect to run it once
  useEffect(() => { b.loadDataForComponent() }, []);
  return <div>{b.viewState.pokemonName}</div>;
};
