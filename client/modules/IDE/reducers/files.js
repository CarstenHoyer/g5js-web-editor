import objectID from 'bson-objectid';
import * as ActionTypes from '../../../constants';

const defaultSketch = `// v0.0.9
// This example is adapted from
// https://generativeartistry.com/tutorials/circle-packing/

const sketch = (p) => {
  const circles = []
  const minRadius = 2
  const maxRadius = 100
  const totalCircles = 100
  const createCircleAttempts = 500

  p.setup = () => {
    p.createCanvas(400, 400)
    p.background(255)
    p.noLoop()
    p.noFill()
  }

  function createAndDrawCircle() {
    let newCircle;
    let circleSafeToDraw = false;
    for (var tries = 0; tries < createCircleAttempts; tries++) {
      newCircle = {
        x: Math.floor(Math.random() * p.width),
        y: Math.floor(Math.random() * p.width),
        radius: minRadius
      }

      if (doesCircleHaveACollision(newCircle)) {
        continue;
      } else {
        circleSafeToDraw = true;
        break;
      }
    }

    if (!circleSafeToDraw) {
      return;
    }

    for (var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
      newCircle.radius = radiusSize;
      if (doesCircleHaveACollision(newCircle)) {
        newCircle.radius--;
        break;
      }
    }

    circles.push(newCircle)
    p.ellipse(newCircle.x, newCircle.y, newCircle.radius * 2)
  }

  function doesCircleHaveACollision(circle) {
    for (var i = 0; i < circles.length; i++) {
      var otherCircle = circles[i];
      var a = circle.radius + otherCircle.radius;
      var x = circle.x - otherCircle.x;
      var y = circle.y - otherCircle.y;

      if (a >= Math.sqrt((x * x) + (y * y))) {
        return true;
      }
    }

    if (circle.x + circle.radius >= p.width ||
      circle.x - circle.radius <= 0) {
      return true;
    }

    if (circle.y + circle.radius >= p.height ||
      circle.y - circle.radius <= 0) {
      return true;
    }

    return false;
  }

  p.draw = () => {
    for (let i = 0; i < totalCircles; i++) {
     createAndDrawCircle();
    }
    console.log(p.gcode.commands.join("\\n"))
  }
}`;

const defaultHTML = `<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
    <script src="bundle.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta charset="utf-8" />

  </head>
  <body>
  <script src="sketch.js"></script>
  <script>
    (function() {
      let x = extend({}, sketch, window.p5)
    })()
  </script>
  </body>
</html>
`;

const defaultCSS = `html, body {
  margin: 0;
  padding: 0;
}
canvas {
  display: block;
}
`;

const initialState = () => {
  const a = objectID().toHexString();
  const b = objectID().toHexString();
  const c = objectID().toHexString();
  const r = objectID().toHexString();
  return [
    {
      name: 'root',
      id: r,
      _id: r,
      children: [a, b, c],
      fileType: 'folder',
      content: ''
    },
    {
      name: 'sketch.js',
      content: defaultSketch,
      id: a,
      _id: a,
      isSelectedFile: true,
      fileType: 'file',
      children: []
    },
    {
      name: 'index.html',
      content: defaultHTML,
      id: b,
      _id: b,
      fileType: 'file',
      children: []
    },
    {
      name: 'style.css',
      content: defaultCSS,
      id: c,
      _id: c,
      fileType: 'file',
      children: []
    }
  ];
};

function getAllDescendantIds(state, nodeId) {
  return state
    .find((file) => file.id === nodeId)
    .children.reduce(
      (acc, childId) => [
        ...acc,
        childId,
        ...getAllDescendantIds(state, childId)
      ],
      []
    );
}

function deleteChild(state, parentId, id) {
  const newState = state.map((file) => {
    if (file.id === parentId) {
      const newFile = { ...file };
      newFile.children = newFile.children.filter((child) => child !== id);
      return newFile;
    }
    return file;
  });
  return newState;
}

function deleteMany(state, ids) {
  const newState = [...state];
  ids.forEach((id) => {
    let fileIndex;
    newState.find((file, index) => {
      if (file.id === id) {
        fileIndex = index;
      }
      return file.id === id;
    });
    newState.splice(fileIndex, 1);
  });
  return newState;
}

const files = (state, action) => {
  const { content, blobURL, name } = action;
  if (state === undefined) {
    state = initialState(); // eslint-disable-line
  }
  switch (action.type) {
    case ActionTypes.UPDATE_FILE_CONTENT:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }

        return { ...file, content };
      });
    case ActionTypes.SET_BLOB_URL:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }
        return { ...file, blobURL };
      });
    case ActionTypes.NEW_PROJECT:
      return [...action.files];
    case ActionTypes.SET_PROJECT:
      return [...action.files];
    case ActionTypes.RESET_PROJECT:
      return initialState();
    case ActionTypes.CREATE_FILE: {
      // eslint-disable-line
      const newState = state.map((file) => {
        if (file.id === action.parentId) {
          const newFile = { ...file };
          newFile.children = [...newFile.children, action.id];
          return newFile;
        }
        return file;
      });
      return [
        ...newState,
        {
          name: action.name,
          id: action.id,
          _id: action._id,
          content: action.content,
          url: action.url,
          children: action.children,
          fileType: action.fileType || 'file'
        }
      ];
    }
    case ActionTypes.UPDATE_FILE_NAME:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }

        return { ...file, name };
      });
    case ActionTypes.DELETE_FILE: {
      const newState = deleteMany(state, [
        action.id,
        ...getAllDescendantIds(state, action.id)
      ]);
      return deleteChild(newState, action.parentId, action.id);
      // const newState = state.map((file) => {
      //   if (file.id === action.parentId) {
      //     const newChildren = file.children.filter(child => child !== action.id);
      //     return { ...file, children: newChildren };
      //   }
      //   return file;
      // });
      // return newState.filter(file => file.id !== action.id);
    }
    case ActionTypes.SET_SELECTED_FILE:
      return state.map((file) => {
        if (file.id === action.selectedFile) {
          return { ...file, isSelectedFile: true };
        }
        return { ...file, isSelectedFile: false };
      });
    case ActionTypes.SHOW_FOLDER_CHILDREN:
      return state.map((file) => {
        if (file.id === action.id) {
          return { ...file, isFolderClosed: false };
        }
        return file;
      });
    case ActionTypes.HIDE_FOLDER_CHILDREN:
      return state.map((file) => {
        if (file.id === action.id) {
          return { ...file, isFolderClosed: true };
        }
        return file;
      });
    default:
      return state;
  }
};

export const getHTMLFile = (state) => state.filter((file) => file.name.match(/.*\.html$/i))[0];
// export const getJSFiles = state => state.filter(file => file.name.match(/.*\.js$/i))
// export const getCSSFiles = state => state.filter(file => file.name.match(/.*\.css$/i))
// export const getLinkedFiles = state => state.filter(file => file.url)

export default files;
