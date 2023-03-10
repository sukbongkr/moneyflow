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
            <p>???????????? : <strong>{totalCashFlow} ??????</strong></p>
            <p>????????? :<strong> {totalAssetPrice} ??????</strong></p>
        </section>
        <section>
            <strong>????????????</strong>
            <div className="grid">
                <article>
                    <header>
                        ??????
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.income == 0 ? null :
                        <li key={a.id}>{a.title} {a.income}??????</li>
                        )
                      }
                    </ul>
                </article>
                <article>
                    <header>
                        ??????
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.outcome == 0 ? null :
                        <li key={a.id}>{a.title} {a.outcome}??????</li>
                        )
                      }
                    </ul>
                </article>
            </div>
        </section>
        <section>
            <strong>???????????????</strong>
            <div className="grid">
                <article>
                    <header>
                        ??????
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.price == 0 ? null :
                        <li key={a.id}>{a.title} {a.price}??????</li>
                        )
                      }
                    </ul>
                </article>
                <article>
                    <header>
                        ??????
                    </header>
                    <ul>
                      {
                        assets.map((a)=>
                        a.debt == 0 ? null :
                        <li key={a.id}>{a.title} {a.debt}??????</li>
                        )
                      }
                    </ul>
                </article>
            </div>
        </section>
        <section>
          <h6>??????????????????</h6>
          <form onSubmit={handleSubmit(onValid)}>
            <label>????????????</label>
            <input type='text' placeholder='????????? ??????????????????' {...register('title',{required : true})}/>
            <label>???????????? ????????? ??????</label>
            <input type='number' placeholder='ex)??????, ?????????...' {...register('income',{required : false})}/>
            <label>????????? ???????????? ??????</label>
            <input type='number' placeholder='ex)????????????'{...register('outcome',{required : false})} />
            <label>????????? ????????????</label>
            <input type='number' placeholder='ex)????????????' {...register('price',{required : false})}/>
            <label>????????? ??????</label>
            <input type='number' placeholder='ex)?????????' {...register('debt',{required : false})}/>
            <button type='submit'>????????????</button>
          </form> 
        </section>
        <section>
          <h6>??????/<span className='text-red'>??????</span>?????????</h6>
          <ul>
              {
                assets.map((a)=>
                  <li key={a.id} className='flex-row'>
                    <p className={a.income-a.outcome < 0 ? 'text-red' : ''}>{a.title}</p>
                    <p onClick={()=>removeAsset(a.id)} className='cursor'><kbd>??????</kbd></p>
                  </li>
                )
              }
          </ul>
        </section>
      </main>
    </> : <p>Loading</p>
  )
}
