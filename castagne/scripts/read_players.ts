import * as anchor from "@coral-xyz/anchor";
import { Castagne } from "../target/types/castagne";
import { getProgramConfig } from "./config";

// set this variable to disable warnings
// export NODE_NO_WARNINGS=1


const read_players = async (
  program: anchor.Program<Castagne>
) => {
  console.log('\n👉Reading players ...');

  let players = await program.account.player.all();

  for (const player of players) {
    console.table({
      user: player.account.user.toString(),
      username: player.account.username,
      xp: player.account.xp,
      attributes: player.account.attributes.toString(),
    });
  }

  console.log('\n👉Total players:', players.length);
}

const main = async () => {

  const {program, provider} = await getProgramConfig();

  try {
    const version = await program.provider.connection.getVersion();
    console.log("🟢Node is running with version");
    console.table(version);
    console.log("\n▸ Provider  :", provider.connection.rpcEndpoint)
    console.log("▸ program id:", program.idl.address);

    await read_players(program);

  } catch (err) {
      console.log("🔴Node not running!");
  }
}

main()
