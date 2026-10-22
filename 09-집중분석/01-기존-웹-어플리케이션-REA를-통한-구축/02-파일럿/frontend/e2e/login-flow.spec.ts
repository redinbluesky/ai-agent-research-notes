import { test, expect } from '@playwright/test'

// 설계 §3 순서로: 대메뉴 → 헤더의 text '로그인' 버튼 클릭 → /login → 입력 → '로그인' 제출 → 데모 안내.
test('main → 헤더 로그인 버튼 클릭 → /login 화면 이동', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()
  await expect(page.getByRole('status')).toContainText('데모')
})

test('직접 GET /login 진입이 헤더 버튼 경로와 같은 화면을 만든다', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()
  await expect(page.locator('#userId')).toBeVisible()
  await expect(page.locator('#password')).toBeVisible()
})

test('빈 제출은 alert이 아닌 인라인 오류 표시', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: '로그인', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveCount(2)
  await expect(page.locator('#userId-error')).toContainText('아이디를 입력하세요')
  await expect(page.locator('#password-error')).toContainText('비밀번호를 입력하세요')
})

test('공백만 입력한 아이디는 오류', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#userId').fill('   ')
  await page.locator('#password').fill('demo1234')
  await page.getByRole('button', { name: '로그인', exact: true }).click()
  await expect(page.locator('#userId-error')).toContainText('아이디를 입력하세요')
})

test('아이디 11자 / 비밀번호 21자 경계 오류 + 데모 문구 미표시', async ({ page }) => {
  await page.goto('/login')
  // maxLength가 타이핑 자체를 10/20자에서 막으므로, 경계 검증 경로(validator)를
  // 확인하기 위해 React 제어 입력의 native setter로 11/21자를 주입한다 (붙여넣기·IME 우회 시나리오).
  await page.evaluate(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    const fire = (id: string, v: string) => {
      const el = document.querySelector(`#${id}`) as HTMLInputElement
      setter.call(el, v)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
    fire('userId', 'a'.repeat(11))
    fire('password', 'x'.repeat(21))
  })
  await page.getByRole('button', { name: '로그인', exact: true }).click()
  await expect(page.locator('#userId-error')).toContainText('10자')
  await expect(page.locator('#password-error')).toContainText('20자')
  await expect(page.getByText('로그인 성공·OTP')).toHaveCount(0)
})

test('유효 입력 제출: 인증 요청 0건 + 데모 안내 표시', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (req) => {
    const url = req.url()
    // 초기 로드(HTML/에셋) 이후 XHR/fetch류 요청만 카운트
    if (req.resourceType() === 'xhr' || req.resourceType() === 'fetch') {
      requests.push(url)
    }
  })

  await page.goto('/login')
  await page.locator('#userId').fill('demo1234')
  await page.locator('#password').fill('demo-pass')
  await page.getByRole('button', { name: '로그인', exact: true }).click()

  await expect(page.getByText('로그인 성공·OTP')).toBeVisible()
  expect(requests).toHaveLength(0)
})

test('뒤로 가기로 로그인 전 경로로 복귀', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
})
