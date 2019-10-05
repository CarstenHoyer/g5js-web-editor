export function resolvePathToFile(filePath, files) {
  const filePathArray = filePath.split('/')
  let resolvedFile
  let currentFile = files.find((file) => file.name === 'root')
  filePathArray.some((filePathSegment, index) => {
    if (filePathSegment === '' || filePathSegment === '.') {
      return false
    }

    if (filePathSegment === '..') {
      return true
    }

    let foundChild = false
    const childFiles = currentFile.children.map((id) => files.find((f) => f._id.valueOf().toString() === id.valueOf()))
    childFiles.some((childFile) => {
      if (childFile.name === filePathSegment) {
        currentFile = childFile
        foundChild = true
        if (index === filePathArray.length - 1) {
          resolvedFile = childFile
        }
        return true
      }
      return false
    })
    return !foundChild
  })
  return resolvedFile
}

export default resolvePathToFile
