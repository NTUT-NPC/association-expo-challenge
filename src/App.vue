<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon>
        <v-avatar size="30" tile>
          <img :src="(() => require('@/assets/logo.png'))()" alt="NPC" />
        </v-avatar>
      </v-app-bar-nav-icon>
      <span class="title font-weight-black">北科程式設計研究社 - NPC</span>
    </v-app-bar>

    <v-content class="d-flex justify-center align-center">
      <v-container fluid>
        <v-card v-if="!finish" max-width="400" class="mx-auto" light>
          <v-card-title class="headline font-weight-black">問答挑戰！</v-card-title>
          <v-card-text>請選出正確的答案</v-card-text>
          <div class="text-center">
            <v-card-text class="headline">{{ currentChallenge.question }}</v-card-text>
          </div>
          <v-card-actions>
            <v-row no-gutters>
              <v-col v-for="(option, index) in currentChallenge.options" :key="index" cols="12">
                <v-btn
                  class="my-1 py-1"
                  large
                  block
                  :color="option.color"
                  @click="onClickOption(option)"
                >{{ option.text }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-card v-else max-width="400" class="mx-auto" light>
          <v-card-title class="headline font-weight-black">已完成問答挑戰！</v-card-title>
          <v-card-text class="title">你答對的題數為</v-card-text>
          <v-card-text class="display-2 text-center">{{ correctCount }}題</v-card-text>
        </v-card>
      </v-container>
    </v-content>

    <v-dialog v-model="showDialog" width="300" persistent>
      <v-card v-show="showDialog">
        <template v-if="isCurrentChallengeCorrect">
          <v-card-title class="title font-weight-black">恭喜答對！</v-card-title>
          <div class="text-center">
            <v-card-text class="headline">沒錯！答案就是</v-card-text>
          </div>
        </template>
        <template v-else>
          <v-card-title class="title font-weight-black">真可惜！</v-card-title>
          <div class="text-center">
            <v-card-text class="headline">答案其實是</v-card-text>
          </div>
        </template>
        <v-card-actions class="px-5">
          <v-row no-gutters>
            <v-col v-for="(answer, index) in currentChallengeAnswers" :key="index" cols="12">
              <v-btn large block :color="answer.color">{{ answer.text }}</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="onClickOk">好喔</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  components: {},
  computed: {
    currentChallengeAnswers () {
      if (this.finish) return null
      return this.currentChallenge.options.filter(option => option.isAnswer)
    }
  },
  data () {
    return {
      challenges: null,
      currentChallenge: null,
      correctCount: 0,
      isCurrentChallengeCorrect: null,
      showDialog: false,
      finish: false
    }
  },
  methods: {
    onClickOption ({ isAnswer }) {
      if (isAnswer) this.correctCount += 1
      this.isCurrentChallengeCorrect = !!isAnswer
      this.showDialog = true
    },
    onClickOk () {
      this.showDialog = false
      this.isCurrentChallengeCorrect = null
      this.nextChallenge()
    },
    nextChallenge () {
      if (this.challenges.length) {
        this.currentChallenge = this.challenges.shift()
      } else {
        this.finish = true
        localStorage.setItem('finish', JSON.stringify({ correctCount: this.correctCount }))
      }
    }
  },
  created () {
    const savedData = JSON.parse(localStorage.getItem('finish'))
    if (savedData) {
      this.finish = true
      this.correctCount = savedData.correctCount
      return
    }
    const colors = ['error', 'info', 'success', 'warning']
    this.challenges = require('@/assets/challenges.json')
      .map(challenge => {
        challenge.options = challenge.options
          .map((option, index) => {
            option.color = colors[index]
            return option
          })
          .sort(() => Math.floor(Math.random() * 3) - 1)
        return challenge
      })
      .sort(() => Math.floor(Math.random() * 3) - 1)
      .slice(0, 5)
    this.nextChallenge()
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  box-sizing: border-box;
}
</style>
