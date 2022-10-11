import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/main/MainPage.vue'
import LoginPage from '../components/user/LoginPage.vue'
import ApplyPage from '../components/vacation/ApplyPage.vue'
import ManagePage from '../components/vacation/ManagePage.vue'
import NoticePage from '../components/notice/NoticePage.vue'
import NoticeReadPage from '../components/notice/NoticeReadPage.vue'
import NoticeWritePage from '../components/notice/NoticeWritePage.vue'
import NoticeModifyPage from '../components/notice/NoticeModifyPage.vue'
import NoticeService from '../services/notice-service'


Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => {
		if (err.name !== 'NavigationDuplicated') throw err;
	});
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainPage
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/apply',
      component: ApplyPage
    },
    {
      path: '/manage',
      component: ManagePage
    },
    {
      path: '/notice',
      component: NoticePage
    },
    {
      path: '/noticeWrite',
      component: NoticeWritePage
    },
    {
			path : '/notice/:noti_id',
      component: NoticeReadPage
		},
    {
			path : '/noticeUpdate/:noti_id',
      beforeEnter(to, from, next){	
        var rslt = confirm('수정 하시겠습니까?')
        if(rslt){
          next('/noticeModify/' + to.params.noti_id)
        }               
			}
		},
    {
			path : '/noticeModify/:noti_id',
      component: NoticeModifyPage
		},
		{
			path : '/noticeDelete/:noti_id',
			beforeEnter(to, from, next){	
        var rslt = confirm('삭제 하시겠습니까?')
          if(rslt){
            var param = Object.assign({}, {noti_id : to.params.noti_id});	
            NoticeService.noticeDelete(param).then(() => {
            alert(to.params.noti_id +'번 공지삭제가 완료되었습니다!')
            next('/notice')
          });
        }        
			}
		}
  ]
})