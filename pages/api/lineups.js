import axios from 'axios';
import GLPK from 'glpk.js';
import path from 'path';


export default async function handler(req, res) {
  try {
    const WEB_URL = process.env.WEB_URL; 
    const contestId = req.query.contestId || '86402';
    const playersResponse = await axios.get(`${WEB_URL}/api/players?contestId=${contestId}`);
    const players = playersResponse.data;
    const lineups = calculateOptimalLineup(players);
    res.json(lineups);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Get the wasm file's URL from the public folder
const wasmURL = typeof window !== 'undefined' ? '/glpk.wasm' : path.resolve(process.cwd(), 'public/glpk.wasm');

let glpk;
(async () => {
  glpk = await GLPK(wasmURL); // Pass the URL when initializing GLPK
})();

function calculateOptimalLineup(players) {
  const lineupSize = 8;

  const positionOrder = {
    PG: 1,
    SG: 2,
    SF: 3,
    PF: 4,
    C: 5,
  };

  const sortedPlayers = players.sort((a, b) => {
    const aOrder = Math.min(
      positionOrder[a.position1],
      positionOrder[a.position2]
    );
    const bOrder = Math.min(
      positionOrder[b.position1],
      positionOrder[b.position2]
    );
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return 0;
  });

  const problem = {
    name: "OptimalNbaLineup",
    objective: {
      direction: glpk.GLP_MAX,
      name: "projectedPoints",
      vars: sortedPlayers.map((_, i) => ({
        name: `x${i}`,
        coef: sortedPlayers[i].projectedPoints,
      })),
    },
    subjectTo: [
      {
        name: "salaryCap",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef: sortedPlayers[i].salary,
        })),
        bnds: { type: glpk.GLP_UP, ub: 50000, lb: 0 },
      },
      // Add position constraints
      {
        name: "PG",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "PG" ||
            sortedPlayers[i].position2 === "PG"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 1 },
      },
      {
        name: "SG",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "SG" ||
            sortedPlayers[i].position2 === "SG"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 1 },
      },
      {
        name: "SF",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "SF" ||
            sortedPlayers[i].position2 === "SF"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 1 },
      },
      {
        name: "PF",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "PF" ||
            sortedPlayers[i].position2 === "PF"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 1 },
      },
      {
        name: "C",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "C" ||
            sortedPlayers[i].position2 === "C"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 1 },
      },
      {
        name: "G",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "PG" ||
            sortedPlayers[i].position1 === "SG" ||
            sortedPlayers[i].position2 === "PG" ||
            sortedPlayers[i].position2 === "SG"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 3 },
      },
      {
        name: "F",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "SF" ||
            sortedPlayers[i].position1 === "PF" ||
            sortedPlayers[i].position2 === "SF" ||
            sortedPlayers[i].position2 === "PF"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_LO, ub: null, lb: 3 },
      },
      {
        name: "maxCenterPlayers",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef:
            sortedPlayers[i].position1 === "C" ||
            sortedPlayers[i].position2 === "C"
              ? 1
              : 0,
        })),
        bnds: { type: glpk.GLP_UP, ub: 2, lb: null },
      },
      {
        name: "lineupSize",
        vars: sortedPlayers.map((_, i) => ({
          name: `x${i}`,
          coef: 1,
        })),
        bnds: { type: glpk.GLP_FX, ub: lineupSize, lb: lineupSize },
      },
    ],
    binaries: players.map((_, i) => `x${i}`),
  };

  const result = glpk.solve(problem);

  if (
    result.result.status === glpk.GLP_UNDEF ||
    result.result.status === glpk.GLP_NOFEAS
  ) {
    return { infeasible: true };
  }

  const optimalLineup = players.filter(
    (_, i) => result.result.vars[`x${i}`] === 1
  );
  const sortedOptimalLineup = optimalLineup.sort((a, b) => {
    const aOrder = positionOrder[a.position1] || positionOrder[a.position2];
    const bOrder = positionOrder[b.position1] || positionOrder[b.position2];
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    return 0;
  });
  

  return { lineup: sortedOptimalLineup };
}
