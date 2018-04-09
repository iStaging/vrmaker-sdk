class Aframe {
  constructor () {
    this.generateAframe = function () {
      const aSceneEl = document.createElement('a-scene')
      const aSkyEl = document.createElement('a-sky')
      const aCameraContainerEl = document.createElement('a-entity')
      const aCameraEl = document.createElement('a-camera')
      const { src } = this.getCurrentPanorama()
      const cameraRotationOffset = 100
      let cameraStartRotation

      this.getCurrentPanorama().cameraStartRotation
        ? cameraStartRotation = this.getCurrentPanorama().cameraStartRotation
        : cameraStartRotation = {}

      aSkyEl.setAttribute('src', src)
      aSceneEl.appendChild(aSkyEl)
      document.body.appendChild(aSceneEl)

      const cameraX = cameraStartRotation.x || 0
      const cameraY = cameraRotationOffset + (cameraStartRotation.y || 0)
      const cameraZ = cameraStartRotation.z || 0

      aCameraContainerEl.setAttribute(
        'rotation',
        `${cameraX} ${cameraY} ${cameraZ}`
      )

      aCameraContainerEl.appendChild(aCameraEl)
      aSceneEl.appendChild(aCameraContainerEl)
      return this
    }
  }
}

export default Aframe
