<template>
  <header>
    <v-breadcrumbs :items="[
        {title: 'home', to: {name: 'home'}},
        {title: '使い方', disabled: true},
    ]"/>
  </header>

  <main>
    <v-container>
      <h1 class="text-h4 font-weight-bold mb-6">積みログ 使い方ガイド</h1>

      <!-- 1. 積みログとは -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6 pa-4 pb-2">
          <v-icon class="mr-2" color="primary">mdi-information-outline</v-icon>
          積みログとは
        </v-card-title>
        <v-card-text>
          <p class="text-body-1 mb-4">
            積みログは、プラモデル・フィギュアのコレクションを管理するためのツールです。
            「積みプラ（買ったまま作っていないプラモデル）」を記録・整理し、
            製作の進捗も一元管理できます。
          </p>
          <p class="text-subtitle-2 text-medium-emphasis mb-2">主な機能</p>
          <v-list density="compact" class="pa-0">
            <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">
              <v-list-item-title>キットの登録・管理（メーカー・ブランド・スケール・価格・画像）</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">
              <v-list-item-title>6種類のステータスで製作進捗を管理</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">
              <v-list-item-title>タグ・ステータスによるフィルタリング</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">
              <v-list-item-title>放置日数の自動計算（最終ステータス更新からの経過日数）</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check-circle-outline" density="compact">
              <v-list-item-title>公開URLで自分のコレクションを共有</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- 2. ユーザー登録の方法 -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6 pa-4 pb-2">
          <v-icon class="mr-2" color="primary">mdi-account-plus-outline</v-icon>
          ユーザー登録の方法
        </v-card-title>
        <v-card-text>
          <v-timeline side="end" density="compact">
            <v-timeline-item
                dot-color="primary"
                size="small"
            >
              <template #opposite>
                <span class="text-caption text-medium-emphasis">STEP 1</span>
              </template>
              <div>
                <p class="text-body-2 font-weight-bold">新規登録ページへ</p>
                <p class="text-body-2 text-medium-emphasis">
                  サイドメニューまたはログイン画面の「新規登録」からアカウント登録ページへ移動します。
                  ユーザー名・メールアドレス・パスワード（8文字以上）を入力して「登録申請」をクリック。
                </p>
              </div>
            </v-timeline-item>
            <v-timeline-item
                dot-color="primary"
                size="small"
            >
              <template #opposite>
                <span class="text-caption text-medium-emphasis">STEP 2</span>
              </template>
              <div>
                <p class="text-body-2 font-weight-bold">メール認証</p>
                <p class="text-body-2 text-medium-emphasis">
                  登録したメールアドレスに認証メールが届きます。
                  メール内のリンクをクリックして認証を完了してください。
                  認証が完了するとアカウントが有効化されます。
                </p>
              </div>
            </v-timeline-item>
            <v-timeline-item
                dot-color="success"
                size="small"
            >
              <template #opposite>
                <span class="text-caption text-medium-emphasis">STEP 3</span>
              </template>
              <div>
                <p class="text-body-2 font-weight-bold">ログイン</p>
                <p class="text-body-2 text-medium-emphasis">
                  認証完了後、ログイン画面でユーザー名とパスワードを入力してログインします。
                  ログイン後は積みリストの管理が可能になります。
                </p>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>

      <!-- 3. キットの登録方法 -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6 pa-4 pb-2">
          <v-icon class="mr-2" color="primary">mdi-plus-box-outline</v-icon>
          キットの登録方法
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            積みリスト画面右上の「キット登録」ボタンから登録ダイアログを開きます。
          </p>
          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th class="text-left">項目</th>
                <th class="text-left">説明</th>
                <th class="text-left">必須</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>キット名</td>
                <td>製品名を入力します（例: HGUC ガンダム RX-78-2）</td>
                <td><v-icon color="error" size="small">mdi-asterisk</v-icon></td>
              </tr>
              <tr>
                <td>ブランド</td>
                <td>
                  製品のブランドを選択します（例: HGUC、MG、1/35 MM）。
                  ブランドにはメーカーが紐づいており、選択するとメーカーが自動表示されます。
                </td>
                <td><v-icon color="error" size="small">mdi-asterisk</v-icon></td>
              </tr>
              <tr>
                <td>スケール</td>
                <td>縮尺を選択します（例: 1/144、1/35、Nonスケール）</td>
                <td><v-icon color="error" size="small">mdi-asterisk</v-icon></td>
              </tr>
              <tr>
                <td>価格</td>
                <td>購入価格を円単位で入力します</td>
                <td><v-icon color="error" size="small">mdi-asterisk</v-icon></td>
              </tr>
              <tr>
                <td>タグ</td>
                <td>「ガンダム」「戦車」「飛行機」など自由に複数設定できます。フィルタリングに活用できます。</td>
                <td>任意</td>
              </tr>
              <tr>
                <td>画像</td>
                <td>
                  パッケージやキットの画像をアップロードできます。
                  JPG・PNG・GIF形式に対応しています。
                </td>
                <td>任意</td>
              </tr>
              <tr>
                <td>説明</td>
                <td>メモや購入動機など自由に記入できます</td>
                <td>任意</td>
              </tr>
            </tbody>
          </v-table>
          <v-alert type="info" variant="tonal" density="compact">
            ブランドやスケールが一覧にない場合は、マスタ管理ページから追加できます（ログイン必須）。
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- 4. ステータスの使い方 -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6 pa-4 pb-2">
          <v-icon class="mr-2" color="primary">mdi-progress-check</v-icon>
          ステータスの使い方
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            各キットには6種類のステータスを設定できます。
          </p>
          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th class="text-left">ステータス</th>
                <th class="text-left">意味</th>
                <th class="text-left">放置日数カウント</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in statusList" :key="s.value">
                <td>
                  <v-chip :color="s.color" variant="tonal" size="small">{{ s.label }}</v-chip>
                </td>
                <td class="text-body-2">{{ s.desc }}</td>
                <td class="text-body-2">{{ s.counts ? 'カウントあり' : 'カウントなし' }}</td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-body-2 text-medium-emphasis mb-2">ステータスの変更方法</p>
          <p class="text-body-2 mb-2">
            キット詳細画面（リストのキット名をクリック）の下部にステータス変更ボタンが表示されます。
            現在のステータスに応じて遷移可能なボタンのみ表示されます。
          </p>
          <v-alert type="info" variant="tonal" density="compact">
            <strong>放置日数</strong>は「積み」「製作中」「中断」のキットのみカウントされます。
            完成・売却済み・素材化になったキットはカウントから除外されます。
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- 5. 共有機能の使い方 -->
      <v-card class="mb-6" variant="outlined">
        <v-card-title class="text-h6 pa-4 pb-2">
          <v-icon class="mr-2" color="primary">mdi-share-variant-outline</v-icon>
          共有機能の使い方
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-4">
            ログイン後、サイドメニューの「自分のページを共有」をクリックすると
            公開ページのURLがクリップボードにコピーされます。
          </p>
          <v-sheet color="grey-lighten-4" rounded class="pa-3 mb-4 font-weight-medium text-body-2">
            https://pmm.sukonbu.xyz/u/<span class="text-primary">ユーザー名</span>
          </v-sheet>
          <v-row>
            <v-col cols="12" md="6">
              <p class="text-subtitle-2 mb-2">
                <v-icon color="success" size="small" class="mr-1">mdi-check</v-icon>
                共有ページでできること
              </p>
              <v-list density="compact" class="pa-0">
                <v-list-item prepend-icon="mdi-eye-outline" density="compact">
                  <v-list-item-title class="text-body-2">コレクション一覧の閲覧</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-filter-outline" density="compact">
                  <v-list-item-title class="text-body-2">ステータス・タグによるフィルタリング</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-chart-bar" density="compact">
                  <v-list-item-title class="text-body-2">サマリー情報の確認（総数・ステータス別集計）</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-card-account-details-outline" density="compact">
                  <v-list-item-title class="text-body-2">個別キットの詳細表示</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <p class="text-subtitle-2 mb-2">
                <v-icon color="error" size="small" class="mr-1">mdi-close</v-icon>
                共有ページでできないこと
              </p>
              <v-list density="compact" class="pa-0">
                <v-list-item prepend-icon="mdi-pencil-off-outline" density="compact">
                  <v-list-item-title class="text-body-2">キットの編集・削除</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-lock-outline" density="compact">
                  <v-list-item-title class="text-body-2">ステータスの変更</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-plus-circle-outline" density="compact">
                  <v-list-item-title class="text-body-2">新規キットの追加</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </v-container>
  </main>
</template>

<script>
export default {
  data: () => ({
    statusList: [
      {value: 'backlog',     label: '積み',     color: 'orange',      desc: '購入済みだがまだ製作していない状態',         counts: true},
      {value: 'in_progress', label: '製作中',   color: 'green',       desc: '現在製作中の状態',                          counts: true},
      {value: 'completed',   label: '完成',     color: 'teal',        desc: '製作が完了した状態',                        counts: false},
      {value: 'on_hold',     label: '中断',     color: 'grey',        desc: '製作を一時停止している状態',                counts: true},
      {value: 'sold',        label: '売却済み', color: 'blue',        desc: '売却・譲渡した状態',                        counts: false},
      {value: 'parted_out',  label: '素材化',   color: 'deep-purple', desc: '改造・素材用に分解・流用した状態',          counts: false},
    ],
  }),
}
</script>
