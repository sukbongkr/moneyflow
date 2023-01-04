import Head from 'next/head'
import { useMemo, useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useAssetStore } from '../store/store'

interface UploadForm {
    id: string
    title: string
    income : number
    outcome : number
    price : number
    debt : number
}

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { register, handleSubmit,reset } = useForm<UploadForm>();
  const { assets, addAsset, removeAsset } = useAssetStore()

  useEffect(() => {
    setIsHydrated(true);
}, []);

  function guid() {
    function s4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const onValid = (data : UploadForm) => {
    const id = guid()
    const debt = data.debt ? parseInt(data.debt.toString()) : 0
    const price = data.price ? parseInt(data.price.toString()) : 0
    const income = data.income ? parseInt(data.income.toString()) : 0
    const outcome = data.outcome ? parseInt(data.outcome.toString()) : 0 
    
    addAsset(
      {
        id : id,
        debt,
        price,
        income,
        outcome,
        title : data.title
      }
    )
    reset()
  }

  const totalCashFlow = useMemo(()=>{
    const totalIncome = assets.map(d=>d.income).reduce((p,c)=>p+c, 0)
    const totalOutcome = assets.map(d=>d.outcome).reduce((p,c)=>p+c, 0)
    
    return parseInt(totalIncome.toString()) - parseInt(totalOutcome.toString())
  }, [assets])

  
  const totalAssetPrice = useMemo(()=>{
    const totalPrice = assets.map(d=>d.price).reduce((p,c)=>p+c, 0)
    const totalDebt = assets.map(d=>d.debt).reduce((p,c)=>p+c, 0)
    
    return parseInt(totalPrice.toString()) - parseInt(totalDebt.toString())
  }, [assets])

  return (
    isHydrated ? 
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className='container'>
        <nav>
            <ul>
                <li><h1>Money Flow</h1></li>
            </ul>
        </nav>
        <section>
            <p>현금흐름 : <strong>{totalCashFlow} 만원</strong></p>
            <p>순자산 :<strong> {totalAssetPrice} 만원</strong></p>
        </section>
        <section>
            <strong>손익계산</strong>
            <div className="grid">
                <article>
                    <header>
                        소득
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.income == 0 ? null :
                        <li key={a.id}>{a.title} {a.income}만원</li>
                        )
                      }
                    </ul>
                </article>
                <article>
                    <header>
                        지출
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.outcome == 0 ? null :
                        <li key={a.id}>{a.title} {a.outcome}만원</li>
                        )
                      }
                    </ul>
                </article>
            </div>
        </section>
        <section>
            <strong>대차대조표</strong>
            <div className="grid">
                <article>
                    <header>
                        자산
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.price == 0 ? null :
                        <li key={a.id}>{a.title} {a.price}만원</li>
                        )
                      }
                    </ul>
                </article>
                <article>
                    <header>
                        부채
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.debt == 0 ? null :
                        <li key={a.id}>{a.title} {a.debt}만원</li>
                        )
                      }
                    </ul>
                </article>
            </div>
        </section>
        <section>
          <h6>자산추가하기</h6>
          <form onSubmit={handleSubmit(onValid)}>
            <label>자산이름</label>
            <input type='text' placeholder='이름을 입력해주세요' {...register('title',{required : true})}/>
            <label>자산에서 나오는 수익</label>
            <input type='number' placeholder='ex)월세, 배당금...' {...register('income',{required : false})}/>
            <label>자산을 유지하는 비용</label>
            <input type='number' placeholder='ex)대출이자'{...register('outcome',{required : false})} />
            <label>자산의 평가가격</label>
            <input type='number' placeholder='ex)현재시세' {...register('price',{required : false})}/>
            <label>자산의 부채</label>
            <input type='number' placeholder='ex)대출금' {...register('debt',{required : false})}/>
            <button type='submit'>추가하기</button>
          </form> 
        </section>
        <section>
          <h6>자산/<span className='text-red'>부채</span>리스트</h6>
          <ul>
              {
                assets.map((a)=>
                  <li key={a.id} className='flex-row'>
                    <p className={a.income-a.outcome < 0 ? 'text-red' : ''}>{a.title}</p>
                    <p onClick={()=>removeAsset(a.id)} className='cursor'><kbd>삭제</kbd></p>
                  </li>
                )
              }
          </ul>
        </section>
      </main>
    </> : <p>Loading</p>
  )
}
