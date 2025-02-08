<template>
    <div v-if="!result">
      <p>
        <select v-model="selectedConstraints">
          <option
            v-for="option in constraintOptions"
            :key="option.label"
            :value="option.constraints"
          >
            {{ option.label }}
          </option>
        </select>
      </p>
      <p>
        <SelectButton v-model="sendType" :options="sendTypeOption" />
      </p>
  
      <p class="error">{{ error }}</p>
  
      <div>
        <qrcode-stream
          :constraints="selectedConstraints"
          :track="paintOutline"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
        />
      </div>
    </div>

    <div v-if="result">
      <button class="back" type="button" @click="result = ''">← Back</button>
      <div class="card">
        <div class="card-title">
          <h2>Result</h2>
        </div>      
        <div class="card-content">
          <p>Issuer : {{ sub.iss }}</p>
          <p>Subject : {{ JSON.stringify(sub.vc.credentialSubject, null, 2) }}</p>
          <button class="button" type="button" @click="accept">Accept</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="js">
  import { decodeJWT } from 'did-jwt';
  import { useRouter } from 'vue-router';
  import { onBeforeUnmount, ref } from 'vue'
  import { QrcodeStream } from 'vue-qrcode-reader'
  import SelectButton from 'primevue/selectbutton'
  import { dbReady, addVC } from '@/utils/vc'
  
  const result = ref('')
  const rawValue = ref('')
  const sub = ref('')
  const sendType = ref('VC')
  const sendTypeOption = ['VC', 'Payload']
  const router = useRouter()
  let stream = null

  onBeforeUnmount(() => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
  })

  async function accept() {
    await dbReady;
    addVC(JSON.parse(JSON.stringify(result.value)), JSON.stringify({"vcjwt":rawValue.value}))
    router.push('/')
  }
  
  async function onDetect(detectedCodes) {
    const detectValueArray = detectedCodes.map((code) => code.rawValue)
    const value = detectValueArray.pop()
    if (sendType.value === 'VC') {
      await sendVC(value)
    } else if (sendType.value === 'Payload') {
      await sendPayload(value)
    }
  }

  async function sendVC(value) {
    try {
      rawValue.value = value
      result.value = await decodeJWT(value)
      sub.value = result.value.payload
    } catch (e) {
      console.error(e)
    }
  }

  async function sendPayload(value) {
    try {
      result.value = JSON.parse(value)
      console.log('catched payload:', result.value)
    } catch (e) {
      console.error(e)
    }
  }
  
  /*** select camera ***/
  
  const selectedConstraints = ref({ facingMode: 'environment' })
  const defaultConstraintOptions = [
    { label: 'rear camera', constraints: { facingMode: 'environment' } },
    { label: 'front camera', constraints: { facingMode: 'user' } }
  ]
  const constraintOptions = ref(defaultConstraintOptions)
  
  async function onCameraReady() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')
  
    constraintOptions.value = [
      ...defaultConstraintOptions,
      ...videoDevices.map(({ deviceId, label }) => ({
        label: `${label}`,
        constraints: { deviceId }
      }))
    ]
  
    error.value = ''
  }
  
  /*** track functons ***/
  
  function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
      const [firstPoint, ...otherPoints] = detectedCode.cornerPoints
  
      ctx.strokeStyle = 'red'
  
      ctx.beginPath()
      ctx.moveTo(firstPoint.x, firstPoint.y)
      for (const { x, y } of otherPoints) {
        ctx.lineTo(x, y)
      }
      ctx.lineTo(firstPoint.x, firstPoint.y)
      ctx.closePath()
      ctx.stroke()
    }
  }

  /*** error handling ***/
  
  const error = ref('')
  
  function onError(err) {
    error.value = `[${err.name}]: `
  
    if (err.name === 'NotAllowedError') {
      error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
      error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
      error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
      error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
      error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
      error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
      error.value +=
        'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
      error.value += err.message
    }
  }
  </script>
  
  <style scoped>
  .select{
    width: 300px;
  }
  .error {
    font-weight: bold;
    color: red;
  }

  .qrcode-stream{
    width :100%;
    height:1/4;
  }

  .button:forcus {
    border-color: transparent;
  }

  .back {
    position:absolute;
    top: 0;
    left: 0;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin: 5%;
    margin-top: 10%; 
  }
  .card-content {
    /* display: flex; */
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  </style>