package com.yyjz.icop.project.projectplan.controller;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yyjz.icop.project.projectplan.entity.ProjectPlanEntity;
import com.yyjz.icop.project.projectplan.entity.ProjectPlanRef;
import com.yyjz.icop.project.projectplan.service.IProjectPlanQueryService;
import com.yyjz.icop.project.projectplan.service.IProjectPlanService;
import com.yyjz.icop.project.projectplan.vo.ProjectPlanVO;
import com.yyjz.icop.businessmgr.maincontract.service.ImainContractServiceApi;
import com.yyjz.icop.businessmgr.maincontract.vo.MainContractVO;
import com.yyjz.icop.exception.BusinessException;
import com.yyjz.icop.metadata.core.data.JsonBackData;
import com.yyjz.icop.orgcenter.staff.service.StaffService;
import com.yyjz.icop.orgcenter.staff.vo.StaffVO;
import com.yyjz.icop.pubapp.platform.context.AppContext;
import com.yyjz.icop.pubapp.platform.query.QuerySchema;
import com.yyjz.icop.pubapp.platform.query.SortItem;
import com.yyjz.icop.pubapp.platform.util.DataObjectUtils;
import com.yyjz.icop.refer.response.RefPagableResponse;
import com.yyjz.icop.share.api.bo.ProjectBO;
import com.yyjz.icop.share.api.service.ProjectAPIService;



/**
 * 
 * <p>前台交互rest服务</p>
 * 
 * <p>@author ICOP  2017-06-18</p>
 *
 * <p>注意：请不要修改该文件中的代码，或者在该文件中添加自定义实现，每次执行“生成代码”都会导致任何对该文件的修改丢失！
 *     如需要扩展功能或者添加自定义实现，请在ProjectPlanControllerExtend类中完成。 </p>
 */
@Controller
@RequestMapping(value = "projectPlan")
public abstract class ProjectPlanController {
	@Autowired
	protected IProjectPlanService projectPlanService;
	@Autowired
	protected IProjectPlanQueryService projectPlanQueryService;
	@Autowired
	private ProjectAPIService projectAPIService;
	@Autowired
	private ImainContractServiceApi mainContractServiceApi;
	@Autowired
	private StaffService staffService;
	
	/**
	 * 新增保存
	 * 
	 * @param projectPlanVO
	 * @return
	 */
	@RequestMapping(value = "insert")
	@ResponseBody
	public JsonBackData insert(@RequestBody ProjectPlanVO projectPlanVO) {
		JsonBackData back = new JsonBackData();
		try {
			ProjectPlanVO backVO = projectPlanService.insert(projectPlanVO);
			//这是我在方法中添加的行
			back.setBackData(backVO);
			back.setBackMsg("新增成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("新增失败:"+e.getMessage());
		}
		return back;

	}

	/**
	 * 修改保存
	 * 
	 * @param projectPlanVO
	 * @return
	 */
	@RequestMapping(value = "update")
	@ResponseBody
	public JsonBackData update(@RequestBody ProjectPlanVO projectPlanVO) {
		JsonBackData back = new JsonBackData();
		try {
			ProjectPlanVO vo = projectPlanService.update(projectPlanVO);
			back.setBackData(vo);
			back.setBackMsg("更新成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("更新失败:"+e.getMessage());
		}
		return back;
	}

	/**
	 * 删除
	 * 
	 * @param projectPlanVOs
	 * @return
	 */
	@RequestMapping(value = "delete")
	@ResponseBody
	public JsonBackData delete(@RequestBody ProjectPlanVO[] projectPlanVOs) {
		JsonBackData back = new JsonBackData();
		try {
			projectPlanService.delete(projectPlanVOs);
			back.setSuccess(true);
			back.setBackMsg("删除成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("删除失败:"+e.getMessage());
		}
		return back;
	}

	/**
	 * 查询详细信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "queryDetail")
	@ResponseBody
	public JsonBackData queryDetail(@RequestParam String id) {
		JsonBackData back = new JsonBackData();
		try {
			ProjectPlanVO vo = projectPlanQueryService.findById(id);
			back.setBackData(vo);
			back.setSuccess(true);
			back.setBackMsg("查询详细信息成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询详细信息失败:"+e.getMessage());
		}
		return back;
	}

	/**
	 * 查询
	 * 
	 * @param QuerySchema
	 * @return
	 */
	@RequestMapping(value = "queryList")
	@ResponseBody
	public JsonBackData queryList(@RequestBody(required = false) QuerySchema querySchema) {
		JsonBackData back = new JsonBackData();
		try {
			//System.out.println(billTypeApiService.findByid("PRO007"));
			
			List<SortItem> sortItems= new ArrayList<SortItem>();
			SortItem sort = new SortItem();
			sort.setField("ts");
			sort.setSort("DESC");
			sortItems.add(sort);
			querySchema.setSort(sortItems);
			Page<ProjectPlanVO> page = projectPlanQueryService.showList(querySchema);
			back.setBackData(page);
			back.setSuccess(true);
			back.setBackMsg("查询列表信息成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询列表信息失败:"+e.getMessage());
		}
		return back;
	}
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/findProjectPlan", method = RequestMethod.GET)
	public @ResponseBody RefPagableResponse findAllUser(@RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
		@RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
		@RequestParam(required = false, value = "searchText") String searchText) {
		RefPagableResponse response = new RefPagableResponse(ProjectPlanRef.class);
		try {
			response.setPageNumber(Integer.valueOf(pageNumber));
			response.setPageSize(Integer.valueOf(pageSize));
		
			List<ProjectPlanRef> noRelationUsers = new ArrayList<ProjectPlanRef>();
			List<ProjectPlanVO> list =new ArrayList<ProjectPlanVO>();
			if(searchText==null||searchText.trim()==""){
				list = (List<ProjectPlanVO>) projectPlanQueryService.getProjectPlanEntityRefall();
			}else{
				list = (List<ProjectPlanVO>) projectPlanQueryService.getProjectPlanEntityRef(searchText);
			}
			for(ProjectPlanVO projectPlanVO : list){
				ProjectPlanRef vos = new ProjectPlanRef();
				vos.setId(projectPlanVO.getId());
				vos.setName(projectPlanVO.getProjectrefname());
				vos.setCode(projectPlanVO.getProjectcode());
				noRelationUsers.add(vos);
			}
//			System.out.println(noRelationUsers);
			response.setList(noRelationUsers);
			response.setCount(Long.valueOf(noRelationUsers.size()));
			response.setMsg("获取项目班子成功！");
			response.setCode(true);
		} catch (Exception e) {
			e.printStackTrace();
			response.setMsg("获取项目班子失败！");
			response.setCode(false);
			return response;
		}
		return response;
	}
	
	/**
	 * 获取人员信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "findperson")
	@ResponseBody
	public JsonBackData findPerson(@RequestParam(name="mypersons")  List<String> mypersons){
		JsonBackData back = new JsonBackData();
		try {
			
			List<StaffVO> pbo= staffService.findStaffs(mypersons);
			back.setBackData(pbo);
			back.setSuccess(true);
			back.setBackMsg("查询详细信息成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询详细信息失败:"+e.getMessage());
		}
		return back;
	}
	
	/**
	 * 查询合同信息
	 * 
	 * @param id
	 * @return
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	@RequestMapping(value = "findcontract")
	@ResponseBody
	public JsonBackData findContract(@RequestParam String id) throws InstantiationException, IllegalAccessException {
		JsonBackData back = new JsonBackData();
		try {
			int projectCount=projectPlanQueryService.getProjectCount(id);
			if(projectCount==0){
				List<MainContractVO> cbo = mainContractServiceApi.findByPrId(id);
				//MainContractVO vo = new MainContractVO();
				MainContractVO newInstance = MainContractVO.class.newInstance();
				if(cbo!=null && cbo.size()>0){
					newInstance = cbo.get(0);
				}
//			    ProjectBO pbo = projectAPIService.queryProjectById(id);
//				ProjectPersonChangeVO vo = projectPersonChangeQueryService.findById(id);
				back.setBackData(newInstance);
				back.setSuccess(true);
				back.setBackMsg("查询详细信息成功");
			}else{
				back.setSuccess(false);
				back.setBackMsg("工程已组建");
			}
			
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询详细信息失败:"+e.getMessage());
		}
		return back;
	}
	/**
	 * 查询项目信息
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "findproject")
	@ResponseBody
	public JsonBackData findProject(@RequestParam String id) {
		JsonBackData back = new JsonBackData();
		try {
			//List<MainContractVO> cbo = mainContractServiceApi.findByPrId(id);
			//MainContractVO vo = new MainContractVO();
			//if(cbo!=null){
			//	vo = cbo.get(0);
			//}
			int projectCount=projectPlanQueryService.getProjectCount(id);
			if(projectCount==0){
			//System.out.println(billTypeApiService.findByid("8a83898b5b9e26f5015b9e75d5250006"));
			//	ProjectBO pbo = projectAPIService.queryProjectById(id);
//					ProjectPersonChangeVO vo = projectPersonChangeQueryService.findById(id);
					back.setBackData(projectCount);
					back.setSuccess(true);
					back.setBackMsg("获取项目成功");
			}else{
				back.setSuccess(false);
				back.setBackMsg("工程已组建");
			}
		   
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询详细信息失败:"+e.getMessage());
		}
		return back;
	}
	/**
	 * 修改billstate
	 * 
	 * @param marketProjectVO
	 * @return
	 */
	@RequestMapping(value = "updateBillState")
	@ResponseBody
	public JsonBackData updateBillState(String bpmId,String billId,String billTypeId,String userId,String operationType,String state) {
		JsonBackData back = new JsonBackData();
		try {
			if(billId != null && state!= null && userId != null ){
				ProjectPlanVO projectPlanVO = projectPlanQueryService.findById(billId);
				projectPlanVO.setBillState(Integer.parseInt(state));
				projectPlanVO.setReviewerid(userId);
				if(Integer.parseInt(state) != 1 && Integer.parseInt(state) != 0){
					projectPlanVO.setReviewer(AppContext.getUserName());
					projectPlanVO.setReviewtime(AppContext.getSysDate());
				}
				
				ProjectPlanVO vo = projectPlanService.update(projectPlanVO);
				back.setBackData(vo);
				back.setBackMsg("更新成功");
				
			}
			} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("单据更新失败:"+e.getMessage());
		}
		return back;
	}
	@ResponseBody
	@RequestMapping(value = "/queryPage")
	public JsonBackData queryPage(@RequestBody(required = false) QuerySchema querySchema) {
		
		int iPageNumber = querySchema.getPageNumber();
		int pageSize = querySchema.getPageSize();
		JsonBackData back = new JsonBackData();
		try {
			Pageable pageable = new PageRequest(iPageNumber, pageSize);
			Page<ProjectPlanEntity> page = (Page<ProjectPlanEntity>) projectPlanQueryService.findAll(new Specification<ProjectPlanEntity>() {
					@Override
						public Predicate toPredicate(Root<ProjectPlanEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
							Predicate criteria = cb.conjunction();
							criteria = cb.and(criteria, cb.equal(root.get("dr"), 0));
							query.where(criteria);
							Order order = cb.desc(root.get("ts"));
							query.orderBy(order);
							return query.getRestriction();
						}
					}, pageable);
			List<ProjectPlanEntity> list = page.getContent();
			List<ProjectPlanVO> vos = new ArrayList<>();
			for (ProjectPlanEntity entity : list) {
				ProjectPlanVO vo = new ProjectPlanVO();
				DataObjectUtils.copyEntityToVO(entity, vo);
				vos.add(vo);
			}
			Page<ProjectPlanVO> retVal = new PageImpl<ProjectPlanVO>(vos, pageable, page.getTotalElements());
			back.setBackData(retVal);
			back.setSuccess(true);
			back.setBackMsg("查询列表信息成功");
		} catch (BusinessException e) {
			back.setSuccess(false);
			back.setBackMsg("查询列表信息失败:"+e.getMessage());
		}
		return back;
		
	}
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/findProjectPlanByPage", method = RequestMethod.GET)
	public @ResponseBody RefPagableResponse findProjectPlanByPage(@RequestParam(value = "pageNumber", defaultValue = "1") int pageNumber,
		@RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
		@RequestParam(required = false, value = "searchText") String searchText) {
		
		RefPagableResponse response = new RefPagableResponse(ProjectPlanRef.class);
		try {
			response.setPageNumber(Integer.valueOf(pageNumber));
			response.setPageSize(Integer.valueOf(pageSize));
		
			List<ProjectPlanRef> noRelationUsers = new ArrayList<ProjectPlanRef>();
			//List<ProjectPlanVO> list = (List<ProjectPlanVO>) projectPlanQueryService.getProjectPlanEntityRef();
			Pageable pageable = new PageRequest(pageNumber, pageSize);
			Page<ProjectPlanEntity> page = (Page<ProjectPlanEntity>) projectPlanQueryService.findAll(new Specification<ProjectPlanEntity>() {
					
						@Override
						public Predicate toPredicate(Root<ProjectPlanEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
							Predicate criteria = cb.conjunction();
							criteria = cb.and(criteria, cb.equal(root.get("dr"), 0));
						//	criteria = cb.and(criteria, cb.equal(root.get("billState"),3));
							query.where(criteria);
							Order order = cb.desc(root.get("ts"));
							query.orderBy(order);
							return query.getRestriction();
						}
					}, pageable);
			List<ProjectPlanEntity> list = page.getContent();
			for(ProjectPlanEntity projectPlanEntity : list){
				ProjectPlanRef vos = new ProjectPlanRef();
				vos.setId(projectPlanEntity.getId());
				vos.setName(projectPlanEntity.getProjectrefname());
				vos.setCode(projectPlanEntity.getProjectcode());
				noRelationUsers.add(vos);
			}
//			System.out.println(noRelationUsers);
			response.setList(noRelationUsers);
			response.setCount(Long.valueOf(noRelationUsers.size()));
			response.setMsg("获取项目班子成功！");
			response.setCode(true);
		} catch (Exception e) {
			e.printStackTrace();
			response.setMsg("获取项目班子失败！");
			response.setCode(false);
			return response;
		}
		return response;
	}

}
