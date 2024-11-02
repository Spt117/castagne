/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/castagne.json`.
 */
export type Castagne = {
  "address": "FvH7Ae6WLxKkb1dt9LZQCSLRhFsiSVvRoj6JR764wt9u",
  "metadata": {
    "name": "castagne",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPlayer",
      "discriminator": [
        19,
        178,
        189,
        216,
        159,
        134,
        0,
        192
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "initFight",
      "discriminator": [
        164,
        147,
        123,
        138,
        176,
        107,
        9,
        210
      ],
      "accounts": [
        {
          "name": "player1",
          "writable": true,
          "signer": true
        },
        {
          "name": "player2",
          "writable": true
        },
        {
          "name": "fightPlayerPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  105,
                  103,
                  104,
                  116,
                  95,
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "fight_pda.counter",
                "account": "fight"
              }
            ]
          }
        },
        {
          "name": "player1Pda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "player1"
              }
            ]
          }
        },
        {
          "name": "player2Pda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "player2"
              }
            ]
          }
        },
        {
          "name": "fightPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  105,
                  103,
                  104,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initFightConfig",
      "discriminator": [
        192,
        2,
        38,
        2,
        50,
        79,
        54,
        101
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "fightPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  105,
                  103,
                  104,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "startFight",
      "discriminator": [
        71,
        101,
        38,
        251,
        235,
        134,
        160,
        209
      ],
      "accounts": [
        {
          "name": "player2",
          "writable": true,
          "signer": true
        },
        {
          "name": "player1",
          "writable": true
        },
        {
          "name": "fightPlayerPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  105,
                  103,
                  104,
                  116,
                  95,
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "counter"
              }
            ]
          }
        },
        {
          "name": "player1Pda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "player1"
              }
            ]
          }
        },
        {
          "name": "player2Pda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "player2"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "counter",
          "type": "u16"
        }
      ]
    },
    {
      "name": "updatePlayer",
      "discriminator": [
        188,
        237,
        209,
        245,
        60,
        160,
        16,
        126
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "attributes",
          "type": {
            "array": [
              "u32",
              3
            ]
          }
        }
      ]
    },
    {
      "name": "updatePlayerXp",
      "discriminator": [
        186,
        167,
        227,
        207,
        253,
        168,
        236,
        156
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true
        },
        {
          "name": "player",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "xp",
          "type": "u32"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "fight",
      "discriminator": [
        147,
        167,
        34,
        162,
        253,
        131,
        207,
        10
      ]
    },
    {
      "name": "fightPlayer",
      "discriminator": [
        61,
        83,
        16,
        55,
        84,
        157,
        236,
        104
      ]
    },
    {
      "name": "player",
      "discriminator": [
        205,
        222,
        112,
        7,
        165,
        155,
        206,
        218
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "levelTooHigh",
      "msg": "Level too high!"
    },
    {
      "code": 6001,
      "name": "playersMustBeDifferent",
      "msg": "Players must be different!"
    },
    {
      "code": 6002,
      "name": "playersMustBeInitilazed",
      "msg": "Fight must be Initilazed!"
    },
    {
      "code": 6003,
      "name": "playerNotExistInFight",
      "msg": "Player must exist in fight!"
    },
    {
      "code": 6004,
      "name": "playerConfigError",
      "msg": "Player must well configured!"
    },
    {
      "code": 6005,
      "name": "playerMustBeSigner",
      "msg": "Player must be signer!"
    }
  ],
  "types": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "fight",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "fightPlayer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u16"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "gameState"
              }
            }
          },
          {
            "name": "player1",
            "type": "pubkey"
          },
          {
            "name": "player2",
            "type": "pubkey"
          },
          {
            "name": "rounds",
            "type": {
              "vec": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "initialized"
          },
          {
            "name": "active"
          },
          {
            "name": "finished"
          },
          {
            "name": "won",
            "fields": [
              {
                "name": "winner",
                "type": "pubkey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "attributes",
            "type": {
              "array": [
                "u32",
                3
              ]
            }
          },
          {
            "name": "xp",
            "type": "u32"
          },
          {
            "name": "fights",
            "type": {
              "vec": "u16"
            }
          }
        ]
      }
    }
  ]
};
