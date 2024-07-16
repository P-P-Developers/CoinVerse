import React, { useEffect, useState } from 'react';
import { Admindashboarddata } from '../../Services/Admin/Addmin';

const Dashboard = () => {

	const [countdata , setCountdata] = useState("")

	const userDetails = JSON.parse(localStorage.getItem("user_details"));
	const user_id = userDetails?.user_id;
   

	const getdashboard = async () => {
		try {
		  const data = { parent_id: user_id };
		  const response = await Admindashboarddata(data);
		  
		  if (response.status) {
			console.log("aa", response.data);
			setCountdata(response.data)
		  } else {
			console.error("Error: ", response.message || "Unknown error occurred");
		  }
		} catch (error) {
		  console.error("API call failed: ", error.message);
		}
	  };
	  
  
	useEffect(()=>{
		getdashboard()
	},[])


	return (
		<div>
			<div class="container-fluid">

				<div class="row">
					<div class="col-xl-12">
						<div className="row main-card">


							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-secondary">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total User
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalUserCount && countdata.TotalUserCount}</h2>
										</div>
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>

									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(163, 199, 241, 1) "
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>
																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>
							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-pink">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total Active User
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalActiveUserCount && countdata.TotalActiveUserCount}</h2>
										</div>
										
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>
									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(229, 159, 241, 1)"
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>

																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-dark">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total Deactive User
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalInActiveUserCount && countdata.TotalInActiveUserCount}</h2>
										</div>
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>
									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(148, 150, 176, 1)"
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>
																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-warning">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total Employe
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalEmployeCount && countdata.TotalEmployeCount}</h2>
										</div>
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>
									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(247, 215, 168, 1)"
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>
																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-dark">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total Active Employe
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalActiveEmployeCount && countdata.TotalActiveEmployeCount}</h2>
										</div>
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>
									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(148, 150, 176, 1)"
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>
																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-md-4"

							>
								<div className="card card-box bg-secondary bg-secondary">
									<div className="card-header border-0 pb-0">
										<div className="chart-num">
											<p>
												<i className="fa-solid fa-sort-down me-2" />
												Total Deactive Employe
											</p>
											<h2 className="font-w600 mb-0">{countdata.TotalInActiveEmployeCount && countdata.TotalInActiveEmployeCount}</h2>
										</div>
										<div className="dlab-swiper-circle">
											<svg
												width={50}
												height={45}
												viewBox="0 0 137 137"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M68.5 0C30.6686 0 0 30.6686 0 68.5C0 106.331 30.6686 137 68.5 137C106.331 137 137 106.331 137 68.5C136.958 30.6865 106.313 0.0418093 68.5 0ZM40.213 63.6068H59.7843C62.4869 63.6068 64.6774 65.7973 64.6774 68.5C64.6774 71.2027 62.4869 73.3932 59.7843 73.3932H40.213C37.5104 73.3932 35.3199 71.2027 35.3199 68.5C35.3199 65.7973 37.5119 63.6068 40.213 63.6068ZM101.393 56.6456L95.5088 86.0883C94.1231 92.9226 88.122 97.8411 81.1488 97.8576H40.213C37.5104 97.8576 35.3199 95.6671 35.3199 92.9644C35.3199 90.2617 37.5119 88.0712 40.213 88.0712H81.1488C83.4617 88.0652 85.4522 86.4347 85.9121 84.168L91.7982 54.7253C92.3208 52.0973 90.6156 49.544 87.9891 49.0214C87.677 48.9601 87.3605 48.9288 87.0439 48.9288H49.9994C47.2967 48.9288 45.1062 46.7383 45.1062 44.0356C45.1062 41.3329 47.2967 39.1424 49.9994 39.1424H87.0439C95.128 39.1454 101.679 45.699 101.677 53.7831C101.677 54.7433 101.582 55.7019 101.393 56.6456Z"
													fill="#FFF"
												/>
											</svg>

										</div>
									</div>
									<div className="card-body p-0">
										<div id="widgetChart1" className="chart-primary">
											<div
												style={{ minHeight: 70, width: 500 }}
											>
												<div
													id="apexcharts2776vne4"
													className="apexcharts-canvas apexcharts2776vne4 apexcharts-theme-light"
													style={{ width: 500, height: 70 }}
												>
													<svg
														id="SvgjsSvg2889"
														width={500}
														height={70}
														xmlns="http://www.w3.org/2000/svg"
														version="1.1"
														xmlnsXlink="http://www.w3.org/1999/xlink"
														className="apexcharts-svg"
														transform="translate(0, 0)"
														style={{ background: "transparent" }}
													>
														<foreignObject x={0} y={0} width={500} height={70}>
															<div
																className="apexcharts-legend"
																xmlns="http://www.w3.org/1999/xhtml"
																style={{ maxHeight: 35 }}
															/>
														</foreignObject>
														<g
															id="SvgjsG2922"
															className="apexcharts-yaxis"
															rel={0}
															transform="translate(-18, 0)"
														/>
														<g
															id="SvgjsG2891"
															className="apexcharts-inner apexcharts-graphical"
															transform="translate(-1, 3)"
														>
															<defs id="SvgjsDefs2890">
																<clipPath id="gridRectMask2776vne4">
																	<rect
																		id="SvgjsRect2893"
																		width={511}
																		height={74}
																		x={-5}
																		y={-5}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
																<clipPath id="forecastMask2776vne4" />
																<clipPath id="nonForecastMask2776vne4" />
																<clipPath id="gridRectMarkerMask2776vne4">
																	<rect
																		id="SvgjsRect2894"
																		width={505}
																		height={68}
																		x={-2}
																		y={-2}
																		rx={0}
																		ry={0}
																		opacity={1}
																		strokeWidth={0}
																		stroke="none"
																		strokeDasharray={0}
																		fill="#fff"
																	/>
																</clipPath>
															</defs>
															<g id="SvgjsG2900" className="apexcharts-grid">
																<g
																	id="SvgjsG2901"
																	className="apexcharts-gridlines-horizontal"
																	style={{ display: "none" }}
																>


																</g>
																<g
																	id="SvgjsG2902"
																	className="apexcharts-gridlines-vertical"
																	style={{ display: "none" }}
																/>
																<line
																	id="SvgjsLine2907"
																	x1={0}
																	y1={64}
																	x2={501}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
																<line
																	id="SvgjsLine2906"
																	x1={0}
																	y1={1}
																	x2={0}
																	y2={64}
																	stroke="transparent"
																	strokeDasharray={0}
																	strokeLinecap="butt"
																/>
															</g>
															<g
																id="SvgjsG2903"
																className="apexcharts-grid-borders"
																style={{ display: "none" }}
															/>
															<g
																id="SvgjsG2895"
																className="apexcharts-line-series apexcharts-plot-series"
															>
																<g
																	id="SvgjsG2896"
																	className="apexcharts-series"
																	zindex={0}
																	seriesname="NetxProfit"
																	data-longestseries="true"
																	rel={1}
																	data-realindex={0}
																>
																	<path
																		id="SvgjsPath2899"
																		d="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		fill="none"
																		fillOpacity={1}
																		stroke="rgba(163, 199, 241, 1) "
																		strokeOpacity={1}
																		strokeLinecap="butt"
																		strokeWidth={6}
																		strokeDasharray={0}
																		className="apexcharts-line"
																		index={0}
																		clipPath="url(#gridRectMask2776vne4)"
																		pathto="M 0 36.57142857142857C 19.483333333333334 36.57142857142857 36.18333333333334 16.457142857142856 55.66666666666667 16.457142857142856C 75.15 16.457142857142856 91.85000000000001 64 111.33333333333334 64C 130.81666666666666 64 147.51666666666668 27.428571428571423 167 27.428571428571423C 186.48333333333335 27.428571428571423 203.18333333333334 64 222.66666666666669 64C 242.15000000000003 64 258.85 18.285714285714285 278.33333333333337 18.285714285714285C 297.8166666666667 18.285714285714285 314.51666666666665 54.857142857142854 334 54.857142857142854C 353.48333333333335 54.857142857142854 370.18333333333334 36.57142857142857 389.6666666666667 36.57142857142857C 409.15000000000003 36.57142857142857 425.85 54.857142857142854 445.33333333333337 54.857142857142854C 464.8166666666667 54.857142857142854 481.51666666666665 0 501 0M 501 0"
																		pathfrom="M -1 73.14285714285714 L -1 73.14285714285714 L 55.66666666666667 73.14285714285714 L 111.33333333333334 73.14285714285714 L 167 73.14285714285714 L 222.66666666666669 73.14285714285714 L 278.33333333333337 73.14285714285714 L 334 73.14285714285714 L 389.6666666666667 73.14285714285714 L 445.33333333333337 73.14285714285714 L 501 73.14285714285714"
																		fillRule="evenodd"
																	/>
																	<g
																		id="SvgjsG2897"
																		className="apexcharts-series-markers-wrap apexcharts-hidden-element-shown"
																		data-realindex={0}
																	/>
																</g>
																<g
																	id="SvgjsG2898"
																	className="apexcharts-datalabels"
																	data-realindex={0}
																/>
															</g>

															<line
																id="SvgjsLine2909"
																x1={0}
																y1={0}
																x2={501}
																y2={0}
																strokeDasharray={0}
																strokeWidth={0}
																strokeLinecap="butt"
																className="apexcharts-ycrosshairs-hidden"
															/>
															<g
																id="SvgjsG2910"
																className="apexcharts-xaxis"
																transform="translate(0, 0)"
															>
																<g
																	id="SvgjsG2911"
																	className="apexcharts-xaxis-texts-g"
																	transform="translate(0, -4)"
																/>
															</g>
															<g id="SvgjsG2923" className="apexcharts-yaxis-annotations" />
															<g id="SvgjsG2924" className="apexcharts-xaxis-annotations" />
															<g id="SvgjsG2925" className="apexcharts-point-annotations" />
														</g>
													</svg>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>


						</div>

						<div class="row">
						
							<div class="col-lg-12">
								<div class="card transaction-table">
									<div class="card-header border-0 flex-wrap pb-0">
										<div class="mb-2">
											<h4 class="card-title">Recent Transactions</h4>
											<p class="mb-sm-3 mb-0">Lorem ipsum dolor sit amet, consectetur</p>
										</div>
										<ul class="float-end nav nav-pills mb-2" role="tablist">
											<li class="nav-item" role="presentation">
												<button class="nav-link active" id="Week-tab" data-bs-toggle="tab" data-bs-target="#Week" type="button" role="tab" aria-controls="month" aria-selected="true">Week</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="month-tab" data-bs-toggle="tab" data-bs-target="#month" type="button" role="tab" aria-controls="month" aria-selected="false" tabindex="-1">Month</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="year-tab" data-bs-toggle="tab" data-bs-target="#year" type="button" role="tab" aria-controls="year" aria-selected="false" tabindex="-1">Year</button>
											</li>
										</ul>
									</div>
									<div class="card-body p-0">
										<div class="tab-content" id="myTabContent1">
											<div class="tab-pane fade show active" id="Week" role="tabpanel" aria-labelledby="Week-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-success font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-success font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class="me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-danger font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
											<div class="tab-pane fade show" id="month" role="tabpanel" aria-labelledby="month-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no" >Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																			<polygon points="0 0 24 0 24 24 0 24"></polygon>
																			<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																			<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																		</g>
																	</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
											<div class="tab-pane fade show" id="year" role="tabpanel" aria-labelledby="year-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>

	);
}

export default Dashboard;

