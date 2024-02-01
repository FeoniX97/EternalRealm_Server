import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import Player from "../system/node/living/character/player/Player";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    let player = new Player(null, "65bb1bb4f079c03b2947ff95", this.clock);
    // await player.isPopulated();
    // this.clock.setTimeout(() => {
    //   player.exp.max.setValue(98);
    // }, 1000);
    // this.clock.setTimeout(() => {
    //   player.exp.min.setValue(99);
    // }, 2000);
    // this.clock.setTimeout(() => {
    //   player.level.setValue(100);
    // }, 3000);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
