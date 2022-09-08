export interface PokeCV{
  id? : number;
  engName : string;
  frName? : string;
  spriteFD? : string;
  url? : string;
}

export interface PokeComplete{
  id? : number;
  name : string;
  frName? : string;
  frDescription? : string;
  sprites? : sprite;
  types? : types[];
  frTypes? : string[];
  height : number;
  weight : number;
  stats : stat[];
  totalStats? : number;
}

export interface sprite{
  back_default : string,
  front_default : string,
  other : otherSprite
}

export interface otherSprite{
  'official-artwork' : {front_default : string}
}

export interface types{
  type : type;
}

export interface type{
  name : string;
  url : string;
}

export interface stat{
  base_stat : number;
}
