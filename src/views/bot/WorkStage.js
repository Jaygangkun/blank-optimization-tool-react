import React from 'react'
import HtmlToReact from 'html-to-react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import * as d3 from 'd3';

// global functions
// convert the array that contains polygon points into string format that can be used by SVG polygon 
function PointsArray_to_PointsString(points){
	var i
	var PointsString ="";
	for (i=0; i<points.length; i++){
		if (i!==0){
			PointsString += " ";
		}
		PointsString += points[i][0];
		PointsString += ",";
		PointsString += points[i][1];
	}
	return PointsString;
}


// sort the polygong points into counterclockwiae order
function Sort_points_CounterClockwise(points_group){
	var i;
	var j;
	var point_temp = [];
	var angle_temp;
	var angle_min;
	var angle_min_index;
	var centroid_point = [];
	centroid_point = Find_centroid(points_group);
	// bubble sorting algorithm to sort all points from the minimum angle to maximum angle, counter clock wise direction
	for (i=0; i<points_group.length-1; i++){
		angle_min_index = i;
		angle_min = calcAngleDegrees(points_group[i][0]-centroid_point[0], points_group[i][1]-centroid_point[1]);
		for (j=i; j<points_group.length; j++){
			angle_temp = calcAngleDegrees(points_group[j][0]-centroid_point[0], points_group[j][1]-centroid_point[1]);
			if (angle_temp < angle_min){
				angle_min = angle_temp;
				angle_min_index = j;
			}
		}
		point_temp = [points_group[i][0],points_group[i][1]];
		points_group[i][0] = points_group[angle_min_index][0];
		points_group[i][1] = points_group[angle_min_index][1];
		points_group[angle_min_index][0] = point_temp[0];
		points_group[angle_min_index][1] = point_temp[1];
	}
}



// find the best fit rectangular shape, return the four nodes array of the rec in counter clock wise sequence
function Best_fit_Rec(Hull_Poly) {
	var i;
	var j =0;;
	var k;
	var points_group = [[]]; 
	var points_line = [[]]; 
	var point_max_dis; 
	var Rec_lines_formula = []; 
	var Rec_corners = []; 
	var Rec_area = 0; 
	var Rec_area_min = 0;
	var Rec_corners_min = []; 
	
	// first initialize the 2 dimensional array that used to store nodes of rectangular.  
	for (k=0; k<4; k++){
			Rec_corners_min[k]=[];
		}
	for (i=0; i<Hull_Poly.length; i++){
		// if the last point reached, use the last point and first point to make the line
		if (i === Hull_Poly.length-1){
			points_line[0] = [Hull_Poly[i][0],Hull_Poly[i][1]];
			points_line[1] = [Hull_Poly[0][0],Hull_Poly[0][1]];
			for (j=1; j<i; j++){
				points_group[j-1] = [Hull_Poly[j][0],Hull_Poly[j][1]];
			}
		} else {
			points_line[0] = [Hull_Poly[i][0],Hull_Poly[i][1]];
			points_line[1] = [Hull_Poly[i+1][0],Hull_Poly[i+1][1]];
			for (j=0; j<i; j++){
				points_group[j] = [Hull_Poly[j][0],Hull_Poly[j][1]];
			}
			for (k=j+2; k<Hull_Poly.length; k++){
				points_group[k-2] = [Hull_Poly[k][0],Hull_Poly[k][1]];
			}
		}
		Rec_lines_formula[0] = Parallel_line_formula (points_line, points_line[0]);
		point_max_dis = Find_the_farest_points (points_line, points_group)
		Rec_lines_formula[2] = Parallel_line_formula (points_line, point_max_dis);
		point_max_dis = Find_the_farest_points_line_formula (Perpendicular_line_formula (points_line, point_max_dis), Hull_Poly)
		Rec_lines_formula[1] = Perpendicular_line_formula (points_line, point_max_dis)

		point_max_dis = Find_the_farest_points_line_formula (Perpendicular_line_formula (points_line, point_max_dis), Hull_Poly)
		
		Rec_lines_formula[3] = Perpendicular_line_formula (points_line, point_max_dis)

		// calculate four corners of the rectangular from the four lines calculated above
		Rec_corners[0] = Find_intersection(Rec_lines_formula[3], Rec_lines_formula[0]);
		Rec_corners[1] = Find_intersection(Rec_lines_formula[0], Rec_lines_formula[1]);
		Rec_corners[2] = Find_intersection(Rec_lines_formula[1], Rec_lines_formula[2]);
		Rec_corners[3] = Find_intersection(Rec_lines_formula[2], Rec_lines_formula[3]);

		// calculate the area of this rectangular 
		Rec_area = d3.polygonArea(Rec_corners)

		if (i === 0){
			Rec_area_min = Math.abs(Rec_area);
			for (k=0; k<4; k++){
				Rec_corners_min[k][0] = Rec_corners[k][0];
				Rec_corners_min[k][1] = Rec_corners[k][1];
			}
		}
		
		// find the rectangular with minimum area
		if (Math.abs(Rec_area) < Rec_area_min){
			Rec_area_min = Math.abs(Rec_area);
			for (k=0; k<4; k++){
				Rec_corners_min[k][0] = Rec_corners[k][0];
				Rec_corners_min[k][1] = Rec_corners[k][1];
			}
		}
	}
	Sort_points_CounterClockwise(Rec_corners_min)
	Rec_corners_min.reverse();
	return Rec_corners_min	
}


function Best_fit_Trapezoid(Rec_corners, Hull_Poly){
	var Trapezoid_1 = [];
	var Trapezoid_2 = [];
	var Rec_corners_temp = [];

	Rec_corners_temp[0] = [Rec_corners[1][0], Rec_corners[1][1]];
	Rec_corners_temp[1] = [Rec_corners[2][0], Rec_corners[2][1]];
	Rec_corners_temp[2] = [Rec_corners[3][0], Rec_corners[3][1]];
	Rec_corners_temp[3] = [Rec_corners[0][0], Rec_corners[0][1]];
	Trapezoid_1 = Trapezoid_fit(Rec_corners, Hull_Poly);
	
	Trapezoid_2 = Trapezoid_fit(Rec_corners_temp, Hull_Poly);
	
	if (d3.polygonArea(Trapezoid_1) < d3.polygonArea(Trapezoid_2)){
		return Trapezoid_1;
	} else {
		return Trapezoid_2;
	}
}


// distance between two points
function Distance_between_points (PointA, PointB){
	return Math.sqrt(Math.pow((PointA[0]-PointB[0]),2) + Math.pow((PointA[1]-PointB[1]),2));
}

// find the point with maximum distance from the line
function Find_the_farest_points (points_line, points_group){
	var i;
	var dis;
	var max_dis =0 ;
	var max_dis_index = 0;
	for (i=0; i<points_group.length; i++) {
		dis = Math.abs((points_line[0][1]-points_line[1][1])*points_group[i][0]+(points_line[1][0]-points_line[0][0])*points_group[i][1]+((points_line[0][0]-points_line[1][0])*points_line[0][1]-(points_line[0][1]-points_line[1][1])*points_line[0][0]))/Math.sqrt(Math.pow((points_line[0][1]-points_line[1][1]),2)+Math.pow((points_line[1][0]-points_line[0][0]),2));
		if (dis > max_dis) {
			max_dis = dis;
			max_dis_index = i;
		}
	}
	return (points_group[max_dis_index])
}

// find the point that has the maximum distance to the line from points_group
function Find_the_farest_points_line_formula (line_formula, points_group){
	var i;
	var dis;
	var max_dis =0 ;
	var max_dis_index = 0;
	for (i=0; i<points_group.length; i++) {
		dis = Math.abs(line_formula[0]*points_group[i][0]+line_formula[1]*points_group[i][1]+line_formula[2])/Math.sqrt(Math.pow(line_formula[0],2)+Math.pow(line_formula[1],2));
		if (dis > max_dis) {
			max_dis = dis;
			max_dis_index = i;
		}
	}
	return (points_group[max_dis_index])
}

// the formula of the perpendicular line: Ax+By+C=0
function Perpendicular_line_formula (points_line, passing_point){
	var line_formula = [];
	line_formula[0] = points_line[1][0] - points_line[0][0];
	line_formula[1] = points_line[1][1] - points_line[0][1];
	line_formula[2] = -line_formula[0]*passing_point[0] - line_formula[1]*passing_point[1];
	//console.log("line_formula = ", line_formula);
	return line_formula;
}

// the formula of the parallel line: Ax+By+C=0
function Parallel_line_formula (points_line, passing_point){
	var line_formula = [];
	line_formula[0] = points_line[1][1] - points_line[0][1];
	line_formula[1] = points_line[0][0] - points_line[1][0];
	line_formula[2] = -line_formula[0]*passing_point[0] - line_formula[1]*passing_point[1];
	//console.log("line_formula = ", line_formula);
	return line_formula;
}

// find the intersection of two lines
function Find_intersection (line_formulaA,line_formulaB){
	var a1 = line_formulaA[0];
	var b1 = line_formulaA[1];
	var c1 = line_formulaA[2];
	var a2 = line_formulaB[0];
	var b2 = line_formulaB[1];
	var c2 = line_formulaB[2];
	return [(b1*c2-b2*c1)/(a1*b2-a2*b1),(a2*c1-a1*c2)/(a1*b2-a2*b1)];
}

function Find_constrain_points_multi_poly (points_poly, constrain_polys){
	var i;
	var j = 0;
	var k;
	var temp_value = 0;
	var constrained_points = [];
	var constrained_status =[];
	var constrained_status_summary = [];
	var index_trace = [];
	for (k = 0; k<constrain_polys.length; k++){
		constrained_status[k]=[];
	}
	for (k = 0; k<constrain_polys.length; k++){
		for (i=0; i<points_poly.length; i++){
			if (d3.polygonContains(constrain_polys[k], points_poly[i])){
				constrained_status[k][i] = 1;
			} else {
				constrained_status[k][i] = 0;
			}
		}
	}
	for (i=0; i<points_poly.length; i++){
		for (k = 0; k<constrain_polys.length; k++){
			temp_value = temp_value + constrained_status[k][i];
		}
		if (temp_value > 0){
			constrained_status_summary[i]=1;
		} else{
			constrained_status_summary[i]=0;
		}
		temp_value = 0;
	}
	for (i=0; i<points_poly.length; i++){
		if (constrained_status_summary[i] > 0){
			constrained_points[j] = [points_poly[i][0], points_poly[i][1]];
			index_trace[j] = i;
			j = j+1;
		}
	}
	return [constrained_points, constrained_status_summary];
}


// calculate the angle between (0 ,0) to (x, y)
function calcAngleDegrees(x, y) {
	return Math.atan2(y, x)*180 / Math.PI;
}

// find the centroid of points
function Find_centroid(points_group){
	var i;
	var N = points_group.length;
	var x = 0;
	var y = 0;
	for (i=0; i<N; i++){
		x = x + points_group[i][0]; 
		y = y + points_group[i][1]; 
	}
	x = x / N;
	y = y / N;
	return [x, y]
}

// function to create the two parallel lines of an edge with distance of d_distance: two lines on both sides of the edge 
function Parallel_lines_with_distance(points_line, d_distance){
	var x1;
	var y1;
	var x2;
	var y2;
	var a1;
	var b1;
	var c1;
	var a2;
	var b2;
	var c2; 
	[a1, b1, c1] = Parallel_line_formula (points_line, points_line[0]);
	[a2, b2, c2] = Perpendicular_line_formula (points_line, points_line[0]);
	
	// calculate the points away from the line with distance d_distance
	y1 = (a1*c2 - c1*a2 + a2*d_distance*Math.sqrt(a1*a1+b1*b1))/(b1*a2-a1*b2);
	x1 = -b2/a2*y1 - c2/a2;
	
	y2 = (a1*c2 - c1*a2 - a2*d_distance*Math.sqrt(a1*a1+b1*b1))/(b1*a2-a1*b2);
	x2 = -b2/a2*y2 - c2/a2;
	
	// calculate the line formula that parallel with line points_line and passing the points just calculated above
	[a1, b1, c1] = Parallel_line_formula (points_line, [x1, y1]);
	[a2, b2, c2] = Parallel_line_formula (points_line, [x2, y2]);
	
	// return line formulas
	return [[a1, b1, c1], [a2, b2, c2]];
}



// find the bounding limit of the trapezoid, this is used for creaing the cutting polygon
function Bounding_limit (Trapezoid_points){
	var i;
	var offset_value = 100;
	var x_min = Trapezoid_points[0][0];
	var x_max = Trapezoid_points[0][0];
	var y_min = Trapezoid_points[0][1];
	var y_max = Trapezoid_points[0][1];
	for (i=0; i<Trapezoid_points.length; i++){
		if (Trapezoid_points[i][0] < x_min){
			x_min = Trapezoid_points[i][0];
		}
		if (Trapezoid_points[i][0] > x_max){
			x_max = Trapezoid_points[i][0];
		}
		if (Trapezoid_points[i][1] < y_min){
			y_min = Trapezoid_points[i][1];
		}
		if (Trapezoid_points[i][1] > y_max){
			y_max = Trapezoid_points[i][1];
		}
	}
	return [x_min - offset_value, x_max + offset_value, y_min - offset_value, y_max + offset_value];
}


// creat the cutting polygon 
function Cutting_polygon (parallel_formulas, bounding_edges){
	var point_intersection = [];
	var line_x_min = [1, 0, -bounding_edges[0]];
	var line_x_max = [1, 0, -bounding_edges[1]];
	var line_y_min = [0, 1, -bounding_edges[2]];
	var line_y_max = [0, 1, -bounding_edges[3]];
	
	// find all four points of the intersection between bounding edges and parallel lines
	if (parallel_formulas[0][0] !== 0){
		point_intersection[0] = Find_intersection (parallel_formulas[0],line_y_min);
		point_intersection[1] = Find_intersection (parallel_formulas[0],line_y_max);
		point_intersection[2] = Find_intersection (parallel_formulas[1],line_y_min);
		point_intersection[3] = Find_intersection (parallel_formulas[1],line_y_max);
	} else {
		point_intersection[0] = Find_intersection (parallel_formulas[0],line_x_min);
		point_intersection[1] = Find_intersection (parallel_formulas[0],line_x_max);
		point_intersection[2] = Find_intersection (parallel_formulas[1],line_x_min);
		point_intersection[3] = Find_intersection (parallel_formulas[1],line_x_max);
	}
	
	// sort all intersection points in counter clocl wise sequence
	Sort_points_CounterClockwise(point_intersection)
	return point_intersection;		
}


// trim the polygon 
function Trim_polygon (points, Best_fit_Trapezoid, points_line, d_distance, constrain_status){
	var i;
	var points_after_trim = [];
	var constrain_status_after_trim = [];
	var trim_line = Parallel_lines_with_distance(points_line, d_distance);
	var edge_limites = Bounding_limit (Best_fit_Trapezoid);
	var trim_poly = Cutting_polygon (trim_line, edge_limites);
	
	for (i=0; i<points.length; i++){
		if (d3.polygonContains(trim_poly, points[i])){
			if (constrain_status[i]) {
				points_after_trim.push([points[i][0], points[i][1]]);
				constrain_status_after_trim.push(constrain_status[i]);
			}
		}else {
			points_after_trim.push([points[i][0], points[i][1]]);
			constrain_status_after_trim.push(constrain_status[i]);
		}
	}
	return [points_after_trim, constrain_status_after_trim];
}



// calculate two points on the line with equal distance away from PointB
// return the point that have the longer distance  
function Point_on_line_with_shift(PointA, PointB){
	var shift_factor = 100;
	var line_formula = [];
	var x1;
	var y1;
	var x2;
	var y2;
	var dis1;
	var dis2;
	line_formula = Parallel_line_formula ([PointA, PointB], PointB);
	// console.log("line_formula  = ", line_formula)
	if (line_formula[1] !== 0){
		x1 = PointB[0]+shift_factor;
		x2 = PointB[0]-shift_factor;
		y1 = (-line_formula[2]-line_formula[0]*x1)/line_formula[1];
		y2 = (-line_formula[2]-line_formula[0]*x2)/line_formula[1];
	} else {
		y1 = PointB[1]+shift_factor;
		y2 = PointB[1]-shift_factor;
		x1 = (-line_formula[2]-line_formula[1]*y1)/line_formula[0];
		x2 = (-line_formula[2]-line_formula[1]*y2)/line_formula[0];
	}

	dis1 = Distance_between_points(PointA, [x1, y1]);
	dis2 = Distance_between_points(PointA, [x2, y2]);

	if (dis1 > dis2) {
		return [x1, y1];
	} else {
		return [x2, y2];
	}
}




// find the best fit trapezoid shape based on one edge of the best fit rec, return the four nodes array of the rec
function Trapezoid_fit(Rec_corners, Hull_Poly) {
	var i;
	var j;
	var k;
	var x1;
	var y1;
	var x2;
	var y2;
	var poly1=[];
	var Hull_Poly1 = [];
	var Hull_Poly2 = [];
	var Hull_Poly1_index_trace = [];
	var Hull_Poly2_index_trace = [];
	var temp_array0 = [];
	var temp_array1 = [];
	var Trapezoid_Poly = [];
	
	
	x1 = (Rec_corners[0][0] + Rec_corners[3][0])/2;
	y1 = (Rec_corners[0][1] + Rec_corners[3][1])/2;
	x2 = (Rec_corners[1][0] + Rec_corners[2][0])/2;
	y2 = (Rec_corners[1][1] + Rec_corners[2][1])/2;
	poly1[0] = [Rec_corners[0][0],Rec_corners[0][1]];
	poly1[1] = [Rec_corners[1][0],Rec_corners[1][1]];
	poly1[2] = [x2, y2];
	poly1[3] = [x1, y1];
	


	temp_array0 = Point_on_line_with_shift(poly1[2], poly1[0]);
	temp_array1 = Point_on_line_with_shift(poly1[3], poly1[1]);

	poly1[0][0] = temp_array0[0];
	poly1[0][1] = temp_array0[1];
	
	poly1[1][0] = temp_array1[0];
	poly1[1][1] = temp_array1[1];
	

	
	j=0;
	k=0;
	for (i=0; i<Hull_Poly.length; i++){
		// if point is outside poly1, store it in Hull_Poly1
		if (d3.polygonContains(poly1, Hull_Poly[i])){
			Hull_Poly2[j] = [Hull_Poly[i][0], Hull_Poly[i][1]];
			Hull_Poly2_index_trace[j] = i;
			j = j+1;
		} else {
			Hull_Poly1[k] = [Hull_Poly[i][0], Hull_Poly[i][1]];
			Hull_Poly1_index_trace[k] = i;
			k = k+1;
		}
	}
	

	//console.log("Hull_Poly.length  = ", Hull_Poly)
	// calculate the line parallel to the two edges of trapezoid and crossing from the middle
	x1 = (Rec_corners[0][0] + Rec_corners[3][0])/2;
	y1 = (Rec_corners[0][1] + Rec_corners[3][1])/2;
	x2 = (Rec_corners[1][0] + Rec_corners[2][0])/2;
	y2 = (Rec_corners[1][1] + Rec_corners[2][1])/2;
	

	j = Hull_Poly2_index_trace[0]; 
	var current_point_status = true; 
	var next_point_status;
	var crossing_point_pair1_1;
	var crossing_point_pair1_2;
	var crossing_point_pair2_1;
	var crossing_point_pair2_2;
	var crossing_point_pair_temp;
	var crossing_counts = 1;
	var line_formula_boundary = [];
	var intersection_A;
	var intersection_B;
	var intersection_C;
	var intersection_D;
	var area_A;
	var area_B;
	
	for (i = 0; i < Hull_Poly.length; i++){
		 j = j+1;
		 if (j === Hull_Poly.length){
			 j = 0;
		 }
		 next_point_status = d3.polygonContains(poly1, Hull_Poly[j]); // true if point contains inside Hull_Poly2
		 if (next_point_status !== current_point_status){ 
			 if (crossing_counts === 1){
				 current_point_status = next_point_status;
				 crossing_counts = crossing_counts +1;
				 if (j === 0){
					 crossing_point_pair1_1 = Hull_Poly.length - 1;
				 } else {
					 crossing_point_pair1_1 = j - 1;
				 }
				 crossing_point_pair1_2 = j;
			 } else {
				 current_point_status = next_point_status;
				 if (j === 0){
					 crossing_point_pair2_1 = Hull_Poly.length - 1;
				 } else {
					 crossing_point_pair2_1 = j - 1;
				 }
				 crossing_point_pair2_2 = j;
			 }
			
		 }
	}

	line_formula_boundary = Parallel_line_formula ([[x1, y1],[x2, y2]], [x1, y1]);
	if ((line_formula_boundary[0]*Hull_Poly[crossing_point_pair1_2][0]+line_formula_boundary[1]*Hull_Poly[crossing_point_pair1_2][1]+line_formula_boundary[2])!==0){
		intersection_A = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair1_1], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_B = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair1_1], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));

		Trapezoid_Poly[0] = [intersection_A[0], intersection_A[1]];
		Trapezoid_Poly[1] = [intersection_B[0], intersection_B[1]];

	} else { // check with the point before and after the point
		intersection_A = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair1_1], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_B = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair1_1], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));
		
		crossing_point_pair_temp = crossing_point_pair1_2 + 1;
		if (crossing_point_pair_temp === Hull_Poly.length){
			crossing_point_pair_temp = 0;
		}
		
		intersection_C = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair_temp], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_D = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair_temp], Hull_Poly[crossing_point_pair1_2]], Hull_Poly[crossing_point_pair1_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));
		
		area_A = Math.abs(d3.polygonArea([intersection_A, intersection_B, Rec_corners[3], Rec_corners[0]]));
		area_B = Math.abs(d3.polygonArea([intersection_C, intersection_D, Rec_corners[3], Rec_corners[0]]));
		
		if (area_A < area_B){
			Trapezoid_Poly[0] = [intersection_A[0], intersection_A[1]];
			Trapezoid_Poly[1] = [intersection_B[0], intersection_B[1]];
		} else {
			Trapezoid_Poly[0] = [intersection_C[0], intersection_C[1]];
			Trapezoid_Poly[1] = [intersection_D[0], intersection_D[1]];
		}

	}
	
	// second check crossing_point_pair2_2 is on the boundary or not
		if ((line_formula_boundary[0]*Hull_Poly[crossing_point_pair2_2][0]+line_formula_boundary[1]*Hull_Poly[crossing_point_pair2_2][1]+line_formula_boundary[2])!==0){

		intersection_A = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair2_1], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_B = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair2_1], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));

		Trapezoid_Poly[2] = [intersection_A[0], intersection_A[1]];
		Trapezoid_Poly[3] = [intersection_B[0], intersection_B[1]];

	} else { 
		intersection_A = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair2_1], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_B = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair2_1], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));
		
		crossing_point_pair_temp = crossing_point_pair2_2 + 1;
		if (crossing_point_pair_temp === Hull_Poly.length){
			crossing_point_pair_temp = 0;
		}
		
		intersection_C = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair_temp], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[1],Rec_corners[0]], Rec_corners[1]));
		intersection_D = Find_intersection (Parallel_line_formula ([Hull_Poly[crossing_point_pair_temp], Hull_Poly[crossing_point_pair2_2]], Hull_Poly[crossing_point_pair2_2]),Parallel_line_formula ([Rec_corners[2],Rec_corners[3]], Rec_corners[2]));
		
		area_A = Math.abs(d3.polygonArea([intersection_B, intersection_A, Rec_corners[1], Rec_corners[2]]));
		area_B = Math.abs(d3.polygonArea([intersection_D, intersection_C, Rec_corners[1], Rec_corners[2]]));
		
		if (area_A < area_B){
			Trapezoid_Poly[2] = [intersection_A[0], intersection_A[1]];
			Trapezoid_Poly[3] = [intersection_B[0], intersection_B[1]];
		} else {
			Trapezoid_Poly[2] = [intersection_C[0], intersection_C[1]];
			Trapezoid_Poly[3] = [intersection_D[0], intersection_D[1]];
		}

	}
	
	Sort_points_CounterClockwise(Trapezoid_Poly)
	Trapezoid_Poly.reverse();

	
	return Trapezoid_Poly;

}



// remesh the polygon only at edges need to be remeshed 
function polygon_edges_interpolation(points, spacing, constrain_status){
	var i;
	var points_interpolation = []; 
	var constrain_status_interpolation = [];
	var k;
	var x;
	var y;
	var distance_AB;
	var number_interpolation;
	var line_formula = [];
	for (i=0; i<points.length-1; i++){
		points_interpolation.push([points[i][0], points[i][1]]);
		constrain_status_interpolation.push(constrain_status[i]);
		distance_AB = Distance_between_points (points[i], points[i+1]);
		if (distance_AB > spacing){
			number_interpolation = Math.ceil(distance_AB/spacing);
			line_formula = Parallel_line_formula ([points[i], points[i+1]], points[i]);
			if (line_formula[1] === 0){
				for (k = 1; k < number_interpolation; k++){
					y = points[i][1] + (points[i+1][1]-points[i][1])/number_interpolation*k;
					x = (-line_formula[1]*y -line_formula[2])/line_formula[0];
					points_interpolation.push([x, y]);
					constrain_status_interpolation.push(0);
				}
			} else {
				for (k = 1; k < number_interpolation; k++){
					x = points[i][0] + (points[i+1][0]-points[i][0])/number_interpolation*k;
					y = (-line_formula[0]*x -line_formula[2])/line_formula[1];
					points_interpolation.push([x, y]);
					constrain_status_interpolation.push(0);
				}
			}
		}
	}
	// calculate the last edge
	points_interpolation.push([points[points.length-1][0], points[points.length-1][1]]);
	distance_AB = Distance_between_points (points[points.length-1], points[0]);
	constrain_status_interpolation.push(constrain_status[points.length-1]);
	if (distance_AB > spacing){
		number_interpolation = Math.ceil(distance_AB/spacing);
		line_formula = Parallel_line_formula ([points[points.length-1], points[0]], points[points.length-1]);
		if (line_formula[1] === 0){
			for (k = 1; k < number_interpolation; k++){
				y = points[points.length-1][1] + (points[0][1]-points[points.length-1][1])/number_interpolation*k;
				x = (-line_formula[1]*y -line_formula[2])/line_formula[0];
				points_interpolation.push([x, y]);
				constrain_status_interpolation.push(0);
			}
		} else {
			for (k = 1; k < number_interpolation; k++){
				x = points[points.length-1][0] + (points[0][0]-points[points.length-1][0])/number_interpolation*k;
				y = (-line_formula[0]*x -line_formula[2])/line_formula[1];
				points_interpolation.push([x, y]);
				constrain_status_interpolation.push(0);
			}
		}
	}
	return [points_interpolation, constrain_status_interpolation];
}




const HtmlToReactParser = new HtmlToReact.Parser();

let svgTagAttr = {};
let svgUpload = null;
let svgDraw = null;
let svgOptimize = null;
let stageWrapContent = null;

let dragImg = null;

let svgRectViewInitial = null;
let svgRectViewDragStart = null;
let dragStartPoint = null;

let pathTry = null;

let svgDomRect = null;

const clearGlobalVars = () => {
    svgTagAttr = {};
    svgUpload = null;
    svgDraw = null;
    svgOptimize = null;
    stageWrapContent = null;
    
    dragImg = null;
    
    svgRectViewInitial = null;
    svgRectViewDragStart = null;
    dragStartPoint = null;
    
    pathTry = null;
    
    svgDomRect = null;
}

const isValidNode = function () {
    return true;
};

const preprocessingInstructions = [
    {
        shouldPreprocessNode: function (node) {
            return node.attribs && node.attribs['data-process'] === 'shared';
        },
        preprocessNode: function (node) {
            node.attribs = {id: `preprocessed-${node.attribs.id}`,};
        },
    }
];

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const processingInstructions = [
    // {
    //     shouldProcessNode: function (node) {
    //         return node.attribs && node.attribs.id === 'preprocessed-first';
    //     },
    //     processNode: function(node, children, index) {
    //         return React.createElement('h1', {key: index, id: node.attribs.id,}, 'First');
    //     },
    // },
    {
        shouldProcessNode: function (node) {
            return node.tagName === 'svg';
        },
        processNode: function (node, children, index) {
            svgTagAttr = node.attribs;

            node.attribs.className = 'svgUpload';
            node.attribs.id = 'svgUpload';            
            return processNodeDefinitions.processDefaultNode(node, children, index);
        },
    },
    {
        shouldProcessNode: function (node) {
            return node.tagName === 'path';
        },
        processNode: function (node, children, index) {
            node.attribs.id = 'pathTry';            
            return processNodeDefinitions.processDefaultNode(node, children, index);
        },
    },
    {
        shouldProcessNode: function (node) {
            return true;
        },
        processNode: processNodeDefinitions.processDefaultNode,
    },
];

function UploadSvg({svgText, visible, clear}) {

    React.useEffect(() => {
        if(svgUpload == null) {
            svgUpload = document.getElementById('svgUpload');
            if(svgUpload) {
                svgDomRect = svgUpload.getBoundingClientRect();
            }            
        }

        if(svgDraw == null) {
            svgDraw = document.getElementById('svgDraw');
        }   

        if(svgOptimize == null) {
            svgOptimize = document.getElementById('svgOptimize');
        }   

        if(stageWrapContent == null) {
            stageWrapContent = document.getElementById('stageWrapContent');
        }

        if(dragImg == null) {
            dragImg = document.createElement("img");
        }

        if(pathTry == null) {
            pathTry = document.getElementById('pathTry');
        }

        if(svgRectViewInitial == null && svgUpload != null) {
            const svgRectViewBox = svgUpload.getAttribute('viewBox').split(' ');
        
            svgRectViewInitial = {
                x: svgRectViewBox[0],
                y: svgRectViewBox[1],
                width: svgRectViewBox[2],
                height: svgRectViewBox[3],
            }
        }
    });

    if(clear) {
        return (
            <></>
        )
    }
    return (
        <div className="UploadSvg" style={!visible ? {display: 'none'} : {}}>
            { HtmlToReactParser.parseWithInstructions(svgText, isValidNode, processingInstructions, preprocessingInstructions) }
        </div>
    )
}

function DrawSvg({constraints, constraintPoints, eventPoints, visible, clear, hideConstraints}) {
    if(clear) {
        return (
            <></>
        )
    }

    return (
        <div className="DrawSvg" style={!visible || hideConstraints ? {display: 'none'} : {}}>
            <svg xmlns={svgTagAttr.xmlns} viewBox={svgTagAttr.viewbox} id="svgDraw">
                {
                    constraints?.map((constraint, index) => {
                        return (
                            <polygon key={index} className="polyline polyline_{index}" opacity="0.3" fill="blue" points={constraint?.points?.toString()}></polygon>
                        )
                    })
                }
                <polygon className="polyline polyline_{index}" opacity="0.3" fill="blue" points={constraintPoints?.toString()}></polygon>
            </svg>
            <div className="DrawSvgPoints">
            {
                eventPoints?.map((point, index) => {
                    return (
                        <span key={index} className="DrawSvgPoint" style={{left: point.x, top: point.y}}/>
                    )
                })
            }
            </div>
        </div>
    )
}

const CASE_50 = '-50';
const CASE_50_500 = '50-500';
const CASE_500_2000 = '500-2000';
const CASE_2000 = '2000-';

function optimizeSVG({ constraints, visible, clear, showOptimizedBlank} ) {
console.log('svgUpload:', svgUpload);
    if(clear) {
        return (
            <></>
        )
    }

    if(pathTry == null) {
        return;
    }

    if(!visible) {
        return;
    }

    d3.select('#svgUpload');

    let Mat_Uti_Improvement = 0.01;
    let Mat_Uti_Points = 2500;
    let Mat_Uti_Steps = 100;
    
    let conditionCase = '';
    if ( svgTagAttr.viewbox.split(' ')[2] < 50 || svgTagAttr.viewbox.split(' ')[3] < 50 )
    {
        conditionCase = CASE_50;
    }
    else if ( (svgTagAttr.viewbox.split(' ')[2] >= 50 && svgTagAttr.viewbox.split(' ')[2] < 500) || (svgTagAttr.viewbox.split(' ')[3] >= 50 && svgTagAttr.viewbox.split(' ')[3] < 500) )
    {
        conditionCase = CASE_50_500;
    }
    else if ( (svgTagAttr.viewbox.split(' ')[2] >= 500 && svgTagAttr.viewbox.split(' ')[2] < 2000) || (svgTagAttr.viewbox.split(' ')[3] >= 500 && svgTagAttr.viewbox.split(' ')[3] < 2000) )
    {
        conditionCase = CASE_500_2000;
    }
    else if ( svgTagAttr.viewbox.split(' ')[2] >= 2000 || svgTagAttr.viewbox.split(' ')[3] >= 2000 )
    {
        conditionCase = CASE_2000;
    }
    
    let NUM_POINTS = Mat_Uti_Points;
    let len = pathTry.getTotalLength();
    let mesh_size = len / NUM_POINTS;
    console.log('mesh_size', mesh_size);

    var pt;
    var points = [];
    var pathTryCircles = [];
    for (var i=0; i < NUM_POINTS; i++) {
        pt = pathTry.getPointAtLength(i * len / NUM_POINTS);
        points.push([pt.x, pt.y]);
        
        if ( conditionCase === CASE_50 )
        {
            pathTryCircles.push({
                'r' : '0.1',
                'fill': 'yellow',
                'cx': pt.x,
                'cy': pt.y
            })
        }
        else if ( conditionCase === CASE_50_500 )
        {
            pathTryCircles.push({
                'r' : '1',
                'fill': 'yellow',
                'cx': pt.x,
                'cy': pt.y
            })
        }
        else if ( conditionCase === CASE_500_2000 )
        {
            pathTryCircles.push({
                'r' : '4',
                'fill': 'yellow',
                'cx': pt.x,
                'cy': pt.y
            })
        }
        else if ( conditionCase === CASE_2000 )
        {
            pathTryCircles.push({
                'r' : '8',
                'fill': 'yellow',
                'cx': pt.x,
                'cy': pt.y
            })
        }
    }

    // plot all mesh points
    var pp_mesh = PointsArray_to_PointsString(points);
    var pathTryPolygons = [];

    if ( conditionCase === CASE_50 )
    {
        pathTryPolygons.push({
            'points': pp_mesh,
            'stroke': 'red',
            'stroke_width': '0.1',
            'fill': 'red'
        })
    }
    else if ( conditionCase === CASE_50_500 )
    {
        pathTryPolygons.push({
            'points': pp_mesh,
            'stroke': 'red',
            'stroke_width': '1',
            'fill': 'red'
        })
    }
    else if ( conditionCase === CASE_500_2000 )
    {
        pathTryPolygons.push({
            'points': pp_mesh,
            'stroke': 'red',
            'stroke_width': '10',
            'fill': 'red'
        })
    }
    else if ( conditionCase === CASE_2000 )
    {
        pathTryPolygons.push({
            'points': pp_mesh,
            'stroke': 'red',
            'stroke_width': '20',
            'fill': 'red'
        })
    }

    console.log('pathTryPolygons:', pathTryPolygons);

    // define constraints
    var constrained_points = [];
    var constrained_status = [];
    
    console.log('constraints:', constraints)
    let constrain_poly = constraints?.map((constraint, index) => {
        return constraint.points
    });
    console.log('constrain_poly:', constrain_poly);

    [constrained_points, constrained_status] = Find_constrain_points_multi_poly (points, constrain_poly);
    
    var constraintCircles = [];
    for (i=0; i < constrained_points.length; i++) {
        if ( conditionCase === CASE_50 )
        {
            constraintCircles.push({
                'r': '0.1',
                'fill': 'blue',
                'cx': constrained_points[i][0],
                'cy': constrained_points[i][1]
            })
        }
        else if ( conditionCase === CASE_50_500 )
        {
            constraintCircles.push({
                'r': '1',
                'fill': 'blue',
                'cx': constrained_points[i][0],
                'cy': constrained_points[i][1]
            })     
        }
        else if ( conditionCase === CASE_500_2000 )
        {
            constraintCircles.push({
                'r': '25',
                'fill': 'blue',
                'cx': constrained_points[i][0],
                'cy': constrained_points[i][1]
            })
        }
        else if ( conditionCase === CASE_2000 )
        {
            constraintCircles.push({
                'r': '50',
                'fill': 'blue',
                'cx': constrained_points[i][0],
                'cy': constrained_points[i][1]
            })
        }
    }

    var Hull_Poly = [];
    var Rec_corners = [];
    var Trapezoid_corners = [];
    var Mat_Utilization ;
    
    
    
    var Mat_Utilization_Improvement = Mat_Uti_Improvement;
    
    // =============================================================================================== //
    //                                             Input                                               //
    // =============================================================================================== //
    var Incremental_step_accuracy = Mat_Uti_Steps;
    
    
    
    var Mat_Utilization_Target ;
    
    
    
    var bestFitPolygons = [];
    // =============================================================================================== //
    //                                             Step 1                                              //
    // =============================================================================================== //
    // convex hull of all points
    Hull_Poly = d3.polygonHull(points)
    
    
    // =============================================================================================== //
    
    
    // =============================================================================================== //
    //                                             Step 2                                              //
    // =============================================================================================== //
    var Area_Poly = d3.polygonArea(points)
    Rec_corners = Best_fit_Rec(Hull_Poly)
    
    // =============================================================================================== //
    
    
    // =============================================================================================== //
    //                                             Step 3                                              //
    // =============================================================================================== //
    // step 3: calculate the best fit trapezoid  Best_fit_Trapezoid
    Trapezoid_corners = Best_fit_Trapezoid(Rec_corners, Hull_Poly);
    // // plot best fit trapezoid
    var plot_Trapezoid_corners = PointsArray_to_PointsString(Trapezoid_corners);
    
    if ( conditionCase === CASE_50 )
    {
        bestFitPolygons.push({
            'points': plot_Trapezoid_corners,
            'stroke': 'green',
            'stroke_width': '0.1',
            'fill': 'none'
        })
    }
    else if ( conditionCase === CASE_50_500 )
    {
        bestFitPolygons.push({
            'points': plot_Trapezoid_corners,
            'stroke': 'green',
            'stroke_width': '1',
            'fill': 'none'
        })
    }
    else if ( conditionCase === CASE_500_2000 )
    {
        bestFitPolygons.push({
            'points': plot_Trapezoid_corners,
            'stroke': 'green',
            'stroke_width': '10',
            'fill': 'none'
        })
    }

    else if ( conditionCase === CASE_2000 )
    {
        bestFitPolygons.push({
            'points': plot_Trapezoid_corners,
            'stroke': 'green',
            'stroke_width': '20',
            'fill': 'none'
        })
    }

    var Area_Trapezoid = d3.polygonArea(Trapezoid_corners)
    Mat_Utilization = Math.abs(Area_Poly)/Area_Trapezoid;
    // calculate the material utilization
    
    
    var feature_length = Math.sqrt(Math.abs(Area_Poly))
    var Incremental_step = feature_length/ Incremental_step_accuracy;

    
    console.log("Blank Optimization Tool V 0.1");
    console.log("Material Utilization_Baseline = ", Mat_Utilization.toFixed(2));
    Mat_Utilization_Target = Mat_Utilization + Mat_Utilization_Improvement;
    console.log("Mat_Utilization_Target = ", Mat_Utilization_Target.toFixed(2));
    
  // =============================================================================================== //
  //                                             Output                                              //
  // =============================================================================================== //
    var Original_Blank_Utilization = Mat_Utilization.toFixed(2);
    var Original_Blank_Size = Area_Trapezoid;
    var Optimization_Target = Mat_Utilization_Target.toFixed(2);
    
    
    
    // =============================================================================================== //
    //                                             Step 4                                              //
    // =============================================================================================== //
    
    
    var j;
    var After_trim1;
    var After_trim2;
    var After_trim3;
    var After_trim4;
    var constrain_status_after_trim1;
    var constrain_status_after_trim2;
    var constrain_status_after_trim3;
    var constrain_status_after_trim4;
    var Area_Poly1;
    var Area_Poly2;
    var Area_Poly3;
    var Area_Poly4;
    
    var Hull_Poly1 = [];
    var Hull_Poly2 = [];
    var Hull_Poly3 = [];
    var Hull_Poly4 = [];
    
    var Rec_corners1 = [];
    var Rec_corners2 = [];
    var Rec_corners3 = [];
    var Rec_corners4 = [];
    
    var Trapezoid_corners1 = [];
    var Trapezoid_corners2 = [];
    var Trapezoid_corners3 = [];
    var Trapezoid_corners4 = [];
    
    var MatUti_after_trim = [];
    
    
    var MatUti_temp;
    var MatUti_index_temp;
    var points_remesh = [];
    var constrained_status_remesh = [];
    
    // 
    var kk=0;
    var feasibility_status = "Feasible";
    
    while (Mat_Utilization < Mat_Utilization_Target){
    
        [After_trim1, constrain_status_after_trim1] = Trim_polygon (points, Trapezoid_corners, [Trapezoid_corners[0], Trapezoid_corners[1]], Incremental_step, constrained_status);
        [After_trim2, constrain_status_after_trim2] = Trim_polygon (points, Trapezoid_corners, [Trapezoid_corners[1], Trapezoid_corners[2]], Incremental_step, constrained_status);
        [After_trim3, constrain_status_after_trim3] = Trim_polygon (points, Trapezoid_corners, [Trapezoid_corners[2], Trapezoid_corners[3]], Incremental_step, constrained_status);
        [After_trim4, constrain_status_after_trim4] = Trim_polygon (points, Trapezoid_corners, [Trapezoid_corners[3], Trapezoid_corners[0]], Incremental_step, constrained_status);
        
    
        Area_Poly1 = Math.abs(d3.polygonArea(After_trim1));
        Area_Poly2 = Math.abs(d3.polygonArea(After_trim2));
        Area_Poly3 = Math.abs(d3.polygonArea(After_trim3));
        Area_Poly4 = Math.abs(d3.polygonArea(After_trim4));
        
    
        // convex hull of all points
        Hull_Poly1 = d3.polygonHull(After_trim1)
        Hull_Poly2 = d3.polygonHull(After_trim2)
        Hull_Poly3 = d3.polygonHull(After_trim3)
        Hull_Poly4 = d3.polygonHull(After_trim4)
        
        // step 2: calculate the best fit rectangular
        Rec_corners1 = Best_fit_Rec(Hull_Poly1)
        Rec_corners2 = Best_fit_Rec(Hull_Poly2)
        Rec_corners3 = Best_fit_Rec(Hull_Poly3)
        Rec_corners4 = Best_fit_Rec(Hull_Poly4)
        
    
        Trapezoid_corners1 = Best_fit_Trapezoid(Rec_corners1, Hull_Poly1);
        Trapezoid_corners2 = Best_fit_Trapezoid(Rec_corners2, Hull_Poly2);
        Trapezoid_corners3 = Best_fit_Trapezoid(Rec_corners3, Hull_Poly3);
        Trapezoid_corners4 = Best_fit_Trapezoid(Rec_corners4, Hull_Poly4);
        
        // calculate area of trapezoid & material utilization
        MatUti_after_trim = [Area_Poly1/d3.polygonArea(Trapezoid_corners1), Area_Poly2/d3.polygonArea(Trapezoid_corners2), Area_Poly3/d3.polygonArea(Trapezoid_corners3), Area_Poly4/d3.polygonArea(Trapezoid_corners4)];
        
        
        MatUti_temp = MatUti_after_trim[0];
        MatUti_index_temp = 0;
        // find the edge with maximum material utilization
        for (i=0; i<4; i++){
            if (MatUti_temp < MatUti_after_trim[i]){
                MatUti_temp = MatUti_after_trim[i];
                MatUti_index_temp = i;
            }
        }
        
    
        
        if (MatUti_temp > Mat_Utilization){
            Mat_Utilization = MatUti_temp;
        } else {
            console.log("maximum Mat Utilization reached, Mat_Utilization = ", Mat_Utilization);
            feasibility_status = "Non-feasible";
            break
        }
    
        
        if (MatUti_index_temp === 0){
            for (j=0; j<After_trim1.length; j++){
                points[j][0] = After_trim1[j][0];
                points[j][1] = After_trim1[j][1];
                constrained_status[j] = constrain_status_after_trim1[j];
            }
            while (j < points.length){
                points.pop();
                constrained_status.pop();
            }
            for (j=0; j<4; j++){
                Trapezoid_corners[j][0] = Trapezoid_corners1[j][0];
                Trapezoid_corners[j][1] = Trapezoid_corners1[j][1];
            }
        } else if (MatUti_index_temp === 1){
            for (j=0; j<After_trim2.length; j++){
                points[j][0] = After_trim2[j][0];
                points[j][1] = After_trim2[j][1];
                constrained_status[j] = constrain_status_after_trim2[j];
            }
            while (j < points.length){
                points.pop();
                constrained_status.pop();
            }
            for (j=0; j<4; j++){
                Trapezoid_corners[j][0] = Trapezoid_corners2[j][0];
                Trapezoid_corners[j][1] = Trapezoid_corners2[j][1];
            }
        } else if (MatUti_index_temp === 2){
            for (j=0; j<After_trim3.length; j++){
                points[j][0] = After_trim3[j][0];
                points[j][1] = After_trim3[j][1];
                constrained_status[j] = constrain_status_after_trim3[j];
            }
            while (j < points.length){
                points.pop();
                constrained_status.pop();
            }
            for (j=0; j<4; j++){
                Trapezoid_corners[j][0] = Trapezoid_corners3[j][0];
                Trapezoid_corners[j][1] = Trapezoid_corners3[j][1];
            }
        } else {
            for (j=0; j<After_trim4.length; j++){
                points[j][0] = After_trim4[j][0];
                points[j][1] = After_trim4[j][1];
                constrained_status[j] = constrain_status_after_trim4[j];
            }
            while (j < points.length){
                points.pop();
                constrained_status.pop();
            }
            for (j=0; j<4; j++){
                Trapezoid_corners[j][0] = Trapezoid_corners4[j][0];
                Trapezoid_corners[j][1] = Trapezoid_corners4[j][1];
            }
        }
        
        [points_remesh, constrained_status_remesh] = polygon_edges_interpolation(points, mesh_size, constrained_status);
        for (i = 0; i<points_remesh.length; i++){
            if (i<points.length){
                points[i][0] = points_remesh[i][0];
                points[i][1] = points_remesh[i][1];
                constrained_status[i] = constrained_status_remesh[i];
            } else {
                points.push(points_remesh[i]);
                constrained_status.push(constrained_status_remesh[i]);
            }
        }
    
        kk=kk+1;
    
    }
    
    console.log("Mat_Utilization final= ", Mat_Utilization.toFixed(2));
    
    //plot the part after trimming
    var After_trim_plot = PointsArray_to_PointsString(points);
    var afterTrimPlotPolygons = [];
    if ( conditionCase === CASE_50 )
    {
        afterTrimPlotPolygons.push({
            'points': After_trim_plot,
            'stroke': 'purple',
            'stroke_width': '0.1',
            'fill': 'purple'
        })
    }
    else if ( conditionCase === CASE_50_500 )
    {
        afterTrimPlotPolygons.push({
            'points': After_trim_plot,
            'stroke': 'purple',
            'stroke_width': '2',
            'fill': 'purple'
        })
    }
    else if ( conditionCase === CASE_500_2000  )
    {
        afterTrimPlotPolygons.push({
            'points': After_trim_plot,
            'stroke': 'purple',
            'stroke_width': '5',
            'fill': 'purple'
        })
    }
    else if ( conditionCase === CASE_2000 )
    {
        afterTrimPlotPolygons.push({
            'points': After_trim_plot,
            'stroke': 'purple',
            'stroke_width': '5',
            'fill': 'purple'
        })
    }

    
    var plot_Trapezoid_corners_trim = PointsArray_to_PointsString(Trapezoid_corners);
    var plotTrapezoidCornersTrimPolygons = [];
    if ( conditionCase === CASE_50 )
    {
        plotTrapezoidCornersTrimPolygons.push({
            'points': plot_Trapezoid_corners_trim,
            'stroke': 'orange',
            'stroke_width': '0.1',
            'fill': 'none'
        })
    }
    else if ( conditionCase === CASE_50_500 )
    {
        plotTrapezoidCornersTrimPolygons.push({
            'points': plot_Trapezoid_corners_trim,
            'stroke': 'orange',
            'stroke_width': '1',
            'fill': 'none'
        })
    
    }
    else if ( conditionCase === CASE_500_2000
    )
    {
        plotTrapezoidCornersTrimPolygons.push({
            'points': plot_Trapezoid_corners_trim,
            'stroke': 'orange',
            'stroke_width': '10',
            'fill': 'none'
        })
    }
    else if ( conditionCase === CASE_2000 )
    {
        plotTrapezoidCornersTrimPolygons.push({
            'points': plot_Trapezoid_corners_trim,
            'stroke': 'orange',
            'stroke_width': '20',
            'fill': 'none'
        })
    }

    var Area_Trapezoid_Opt = d3.polygonArea(Trapezoid_corners);
    // =============================================================================================== //
    //                                             Output                                              //
    // =============================================================================================== //
    var Final_Blank_Utilization = Mat_Utilization.toFixed(2);
    var Feasibility = feasibility_status;
    var Final_Blank_Size = Area_Trapezoid_Opt;
    var Final_Blank_Size_percentage = (Final_Blank_Size/Original_Blank_Size).toFixed(2);

    return (
        <div className="OptimizeSvg">
            <div className="OptimizeInfo">
                <div className="OptimizeInfoRow">
                    <span className="OptimizeInfoTitle">Original Blank Utilization: </span><span className="OptimizeInfoValue">{ Math.round(Original_Blank_Utilization*100) }%</span>
                </div>
                <div className="OptimizeInfoRow">
                    <span className="OptimizeInfoTitle">Original Blank Size: </span><span className="OptimizeInfoValue">{ Original_Blank_Size.toFixed(2) }</span>
                </div>
                <div className="OptimizeInfoRow">
                    <span className="OptimizeInfoTitle">Optimization Target: </span><span className="OptimizeInfoValue">{ Math.round(Optimization_Target*100) } ({ Feasibility })</span>
                </div>
                <div className="OptimizeInfoRow">
                    <span className="OptimizeInfoTitle">Final Blank Utilization: </span><span className="OptimizeInfoValue">{ Math.round(Final_Blank_Utilization*100) }%</span>
                </div>
                <div className="OptimizeInfoRow">
                    <span className="OptimizeInfoTitle">Final Blank Size: </span><span className="OptimizeInfoValue">{ Final_Blank_Size.toFixed(2) } &amp; { Math.round(Final_Blank_Size_percentage*100) }%</span>
                </div>
            </div>
            <svg xmlns={svgTagAttr.xmlns} viewBox={svgTagAttr.viewbox} id="svgOptimize">
                <g transform="translate(0, 0)">
                {
                    !showOptimizedBlank && constraints?.map((constraint, index) => {
                        return (
                            <polygon key={'constraint-polygon-' + index} className="polyline polyline_{index}" stroke="red" fill="red" points={constraint?.points?.toString()}></polygon>
                        )
                    })
                }
                {
                    !showOptimizedBlank && pathTryCircles?.map((circle, index) => {
                        return (
                            <circle key={'try-path-circle-' + index} r={circle.r} fill={circle.fill} cx={circle.cx} cy={circle.cy}></circle>
                        )
                    })
                }
                {
                    !showOptimizedBlank && pathTryPolygons?.map((polygon, index) => {
                        return (
                            <polygon key={'try-path-polygon-' + index} points={polygon.points} stroke={polygon.stroke} strokeWidth={polygon.stroke_width} fill={polygon.fill}></polygon>
                        )
                    })
                }
                {
                    !showOptimizedBlank && constraintCircles?.map((circle, index) => {
                        return (
                            <circle key={'contraint-circle-' + index} r={circle.r} fill={circle.fill} cx={circle.cx} cy={circle.cy}></circle>
                        )
                    })
                }
                {
                    !showOptimizedBlank && bestFitPolygons?.map((polygon, index) => {
                        return (
                            <polygon key={'try-path-polygon-' + index} points={polygon.points} stroke={polygon.stroke} strokeWidth={polygon.stroke_width} fill={polygon.fill}></polygon>
                        )
                    })
                }
                {
                    afterTrimPlotPolygons?.map((polygon, index) => {
                        return (
                            <polygon key={'try-path-polygon-' + index} points={polygon.points} stroke={polygon.stroke} strokeWidth={polygon.stroke_width} fill={polygon.fill}></polygon>
                        )
                    })
                }
                {
                    !showOptimizedBlank && plotTrapezoidCornersTrimPolygons?.map((polygon, index) => {
                        return (
                            <polygon key={'try-path-polygon-' + index} points={polygon.points} stroke={polygon.stroke} strokeWidth={polygon.stroke_width} fill={polygon.fill}></polygon>
                        )
                    })
                }
                </g>
            </svg>
        </div>
    )
}

function WorkToolBarButton(props) {
    const className = props.active ? "btn btn-sm btn-active mx-1 rounded" : (props.enable ? "btn btn-sm btn-enable mx-1 rounded" : "btn btn-sm btn-secondary mx-1 rounded disabled");
    return (
        <span className={className} onClick={props.onClick}>
            {props.children}
        </span>
    )
}

const zoom = (direction) => {

    if(svgUpload == null) {
        return;
    }

    if(svgDraw == null) {
        return;
    }

    if(direction === 'out') {
        svgUpload.setAttribute(
            'viewBox',
            svgUpload.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgUpload.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (parseInt(svgUpload.getAttribute('viewBox').split(' ')[2]) + parseInt(svgUpload.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (parseInt(svgUpload.getAttribute('viewBox').split(' ')[3]) + parseInt(svgUpload.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        svgDraw.setAttribute(
            'viewBox',
            svgDraw.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgDraw.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (parseInt(svgDraw.getAttribute('viewBox').split(' ')[2]) + parseInt(svgDraw.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (parseInt(svgDraw.getAttribute('viewBox').split(' ')[3]) + parseInt(svgDraw.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        if(svgOptimize) {
            svgOptimize.setAttribute(
                'viewBox',
                svgOptimize.getAttribute('viewBox').split(' ')[0] + ' ' + 
                svgOptimize.getAttribute('viewBox').split(' ')[1] + ' ' + 
                (parseInt(svgOptimize.getAttribute('viewBox').split(' ')[2]) + parseInt(svgOptimize.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
                (parseInt(svgOptimize.getAttribute('viewBox').split(' ')[3]) + parseInt(svgOptimize.getAttribute('viewBox').split(' ')[3]*0.1))
            );
        }
    }
    else if (direction === "in")
    {
        svgUpload.setAttribute(
            'viewBox',
            svgUpload.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgUpload.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (parseInt(svgUpload.getAttribute('viewBox').split(' ')[2]) - parseInt(svgUpload.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (parseInt(svgUpload.getAttribute('viewBox').split(' ')[3]) - parseInt(svgUpload.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        svgDraw.setAttribute(
            'viewBox',
            svgDraw.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgDraw.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (parseInt(svgDraw.getAttribute('viewBox').split(' ')[2]) - parseInt(svgDraw.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (parseInt(svgDraw.getAttribute('viewBox').split(' ')[3]) - parseInt(svgDraw.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        if(svgOptimize) {
            svgOptimize.setAttribute(
                'viewBox',
                svgOptimize.getAttribute('viewBox').split(' ')[0] + ' ' + 
                svgOptimize.getAttribute('viewBox').split(' ')[1] + ' ' + 
                (parseInt(svgOptimize.getAttribute('viewBox').split(' ')[2]) - parseInt(svgOptimize.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
                (parseInt(svgOptimize.getAttribute('viewBox').split(' ')[3]) - parseInt(svgOptimize.getAttribute('viewBox').split(' ')[3]*0.1))
            ); 
        }
    }
}

const panMove = (offset) => {
    if(svgUpload == null) {
        return;
    }

    if(svgDraw == null) {
        return;
    }

    // convert view offset to svg offset
    if(svgDomRect == null) {
        return;
    }

    const viewBoxOffset = {
        x: offset.x * svgRectViewDragStart.width / svgDomRect.width,
        y: offset.y * svgRectViewDragStart.height / svgDomRect.height
    }
    
    svgUpload.setAttribute(
        'viewBox',
        (parseInt(svgRectViewDragStart.x) + parseInt(viewBoxOffset.x)) + ' ' + 
        (parseInt(svgRectViewDragStart.y) + parseInt(viewBoxOffset.y)) + ' ' + 
        svgRectViewDragStart.width + ' ' + 
        svgRectViewDragStart.height
    );

    svgDraw.setAttribute(
        'viewBox',
        (parseInt(svgRectViewDragStart.x) + parseInt(viewBoxOffset.x)) + ' ' + 
        (parseInt(svgRectViewDragStart.y) + parseInt(viewBoxOffset.y)) + ' ' + 
        svgRectViewDragStart.width + ' ' + 
        svgRectViewDragStart.height
    );

    if(svgOptimize) {
        svgOptimize.setAttribute(
            'viewBox',
            (parseInt(svgRectViewDragStart.x) + parseInt(viewBoxOffset.x)) + ' ' + 
            (parseInt(svgRectViewDragStart.y) + parseInt(viewBoxOffset.y)) + ' ' + 
            svgRectViewDragStart.width + ' ' + 
            svgRectViewDragStart.height
        );
    }
    
}


function WorkStage() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', '.svg');
    // const [svgElement, setSvgElement] = React.useState('');
    const [ svgFile, setSvgFile ] = React.useState('');
    const readFile = function(evt) {
        var reader  = new FileReader();
        reader.readAsText(fileSelector.files[0]);
        reader.onloadend = function () {
            setSvgFile(reader.result);
            setBtnEditEnable(true);
            setBtnZoomInEnable(true);
            setBtnZoomOutEnable(true);
            setBtnHandEnable(true);
            setBtnResetEnable(true);
        }
    }

    fileSelector.addEventListener('change', readFile, false);
    const openFile = function() {
        fileSelector.click();
    }

    // status for toolbar buttons
    const [btnEditEnable, setBtnEditEnable] = React.useState(false);
    const [btnZoomInEnable, setBtnZoomInEnable] = React.useState(false);
    const [btnZoomOutEnable, setBtnZoomOutEnable] = React.useState(false);
    const [btnHandEnable, setBtnHandEnable] = React.useState(false);
    const [btnResetEnable, setBtnResetEnable] = React.useState(false);

    const [btnEditActive, setBtnEditActive] = React.useState(false);
    const [btnHandActive, setBtnHandActive] = React.useState(false);

    // status for menu items
    const [optimized, setOptimized] = React.useState(false);
    const [clear, setClear] = React.useState(false);
    const [hideConstraints, setHideConstraints] = React.useState(false);
    const [showOptimizedBlank, setShowOptimizedBlank] = React.useState(false);

    // status for edit
    const [isEdit, setIsEdit] = React.useState(false);

    // variables for drawing points
    const [constraints, setConstraints] = React.useState([]);
    const [constraintPoints, setConstraintPoints] = React.useState([]);
    const [eventPoints, setEventPoints] = React.useState([]);
    
    const stageClick = function(event) {
        if(svgUpload == null || svgDraw == null) {
            return;
        }

        if(typeof svgUpload == 'undefined') {
            alert('No SVG Uploaded!');
            return;
        }

        if(btnHandActive) {
            return;
        }

        if(!isEdit) {
            alert('Please Click Constraint Icon');
            return;
        }

        if(svgUpload.firstElementChild.tagName === 'g') {

        }
        else {
            const pt = svgUpload.createSVGPoint();    
                
            // pass event coordinates
            pt.x = event.clientX;
            pt.y = event.clientY;
        
            // transform to SVG coordinates
            const svgP = pt.matrixTransform(svgUpload.getScreenCTM().inverse());

            setConstraintPoints([...constraintPoints, [svgP.x, svgP.y]]);

            setEventPoints([...eventPoints, {x: event.clientX - stageWrapContent.getBoundingClientRect().left, y: event.clientY - stageWrapContent.getBoundingClientRect().top}]);
        }
    }

    
    // drag functions
    const stageDragStart = function(event) {

        if(!btnHandActive) {
            return;
        }

        event.dataTransfer.setDragImage(dragImg, 0, 0);

        const svgRectViewBox = svgUpload.getAttribute('viewBox').split(' ');
        
        svgRectViewDragStart = {
            x: svgRectViewBox[0],
            y: svgRectViewBox[1],
            width: svgRectViewBox[2],
            height: svgRectViewBox[3],
        }

        dragStartPoint = {
            x: event.clientX,
            y: event.clientY
        };
    }

    const stageDragEnd = function(event) {
        if(!btnHandActive) {
            return;
        }

        svgRectViewDragStart = null;
        dragStartPoint = null;
    }

    const stageDrag = function(event) {
        
        if(!btnHandActive) {
            return;
        }

        if(event.clientX !== 0 && event.clientY !== 0) {
            panMove({
                x: dragStartPoint.x - event.clientX,
                y: dragStartPoint.y - event.clientY
            })
        }
    }

    

    const cbOpenBtnClick = function() {
        setClear(false)
        openFile()
    }

    const cbEditBtnClick = function() {
        if(isEdit) {
            setConstraints([...constraints, {points: constraintPoints}])
            setConstraintPoints([]);
            setEventPoints([]);

            setBtnZoomInEnable(true);
            setBtnZoomOutEnable(true);
            setBtnHandEnable(true);

            setBtnEditActive(false);
        }
        else {
            setBtnZoomInEnable(false);
            setBtnZoomOutEnable(false);
            setBtnHandEnable(false);

            setBtnEditActive(true);
        }

        setIsEdit(!isEdit);

        setBtnHandActive(false);
    }

    const cbZoomInBtnClick = function() {
        zoom('in')

        setBtnEditActive(false);
        setBtnHandActive(false);
    }

    const cbZoomOutBtnClick = function() {
        zoom('out')

        setBtnEditActive(false);
        setBtnHandActive(false);
    }

    const cbHandBtnClick = function() {
        
        setBtnEditActive(false);
        setBtnHandActive(true);
    }

    const cbResetBtnClick = function() {

        if(svgUpload == null) {
            return;
        }
    
        if(svgDraw == null) {
            return;
        }
    
        svgUpload.setAttribute(
            'viewBox',
            parseInt(svgRectViewInitial.x) + ' ' + 
            parseInt(svgRectViewInitial.y) + ' ' + 
            svgRectViewInitial.width + ' ' + 
            svgRectViewInitial.height
        );
    
        svgDraw.setAttribute(
            'viewBox',
            parseInt(svgRectViewInitial.x) + ' ' + 
            parseInt(svgRectViewInitial.y) + ' ' + 
            svgRectViewInitial.width + ' ' + 
            svgRectViewInitial.height
        );

        setBtnEditActive(false);
        setBtnHandActive(false);
    }
    

    // callback functions for menu items
    const menuClickOptimize = () => {
    
        setOptimized(true);
        
    }

    const menuClickClear = () => {
        setBtnEditEnable(false)
        setBtnZoomInEnable(false)
        setBtnZoomOutEnable(false)
        setBtnHandEnable(false)
        setBtnResetEnable(false)
    
        setBtnEditActive(false)
        setBtnHandActive(false)

        clearGlobalVars();

        setClear(true);

        setSvgFile('');
        setOptimized(false);

        setConstraints([]);
        setConstraintPoints([]);
        setEventPoints([]);
    }

    const menuClickDownloadSVG = () => {
        var svgOptimize = document.getElementById('svgOptimize');

        if(svgOptimize) {
            svgOptimize.style.width = null;
            svgOptimize.style.height = null;
            svgOptimize.setAttribute("overflow", "visible");
            svgOptimize.setAttribute("preserveAspectRatio", "xMinYMid meet");
    
            var serializer = new XMLSerializer();
            //setting currentColor to black matters if computed styles are not used
            var svgString = serializer.serializeToString(svgOptimize).replace(/currentColor/g, "black");
    
            //add namespaces
            if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                svgString = svgString.replace(/^<svg/, "<svg xmlns=\"http://www.w3.org/2000/svg\"");
            }
            if (!svgString.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
                svgString = svgString.replace(/^<svg/, "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
            }
            
            svgString = "<?xml version=\"1.0\" standalone=\"no\"?>\r\n" + svgString;
    
            //convert svg string to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    
            var link = document.getElementById('downloadLink');
            link.href=url;
            link.click();
        }
        
    }

    const menuClickDownloadJPEG = () => {
        var svgOptimize = document.getElementById('svgOptimize');

        if(svgOptimize) {
            svgOptimize.style.width = null;
            svgOptimize.style.height = null;
            svgOptimize.setAttribute("overflow", "visible");
            svgOptimize.setAttribute("preserveAspectRatio", "xMinYMid meet");
    
            var serializer = new XMLSerializer();
            //setting currentColor to black matters if computed styles are not used
            var svgString = serializer.serializeToString(svgOptimize).replace(/currentColor/g, "black");
    
            //add namespaces
            if (!svgString.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                svgString = svgString.replace(/^<svg/, "<svg xmlns=\"http://www.w3.org/2000/svg\"");
            }
            if (!svgString.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
                svgString = svgString.replace(/^<svg/, "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
            }
            
            var downloadCanvas = document.getElementById('downloadCanvas');
            var ctx = downloadCanvas.getContext("2d");
            window.canvg.Canvg.fromString(ctx, svgString).start();

            var url = downloadCanvas.toDataURL("image/jpeg");
    
            var link = document.getElementById('downloadLink');
            link.href=url;
            link.click();
        }
        
    }

    const menuClickShowOptimizedBlank = () => {
        setShowOptimizedBlank(true);
    }

    const menuClickShowAll = () => {
        setShowOptimizedBlank(false);
    }

    const menuClickHideConstraints = () => {
        setHideConstraints(true);
    }
     
    const menuClickShowConstraints = () => {
        setHideConstraints(false);
    }

    const menuClickRemoveConstraints = () => {
        if(constraints.length > 0) {
            const newConstraints = constraints.slice();
            newConstraints.splice(-1);

            setConstraints(newConstraints);
        }
    }

    return (
        <Row>
            <Col sm="12" md="6" lg="6">
                <Card>
                    <CardTitle className="border-bottom p-3 mb-0">                        
                        <div className="d-flex align-items-center justify-content-between">
                            <span>Canvas</span>
                            <div className="">
                                <WorkToolBarButton enable={true} onClick={() => cbOpenBtnClick()}><i className="fas fa-folder-open"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnEditEnable} active={btnEditActive} onClick={() => cbEditBtnClick()}><i className={isEdit ? "fas fa-check" : "fas fa-cog"}></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnZoomInEnable} onClick={() => cbZoomInBtnClick()}><i className="fas fa-search-plus"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnZoomOutEnable} onClick={() => cbZoomOutBtnClick()}><i className="fas fa-search-minus"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnHandEnable} active={btnHandActive} onClick={() => cbHandBtnClick()}><i className="fas fa-hand-paper"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnResetEnable} onClick={() => cbResetBtnClick()}><i className="fas fa-undo"></i></WorkToolBarButton>
                            </div>
                            <Nav className="">
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle
                                        nav
                                        className="pro-pic d-flex align-items-center"
                                    >
                                        <i className="icon-options-vertical"></i>
                                    </DropdownToggle>
                                    <DropdownMenu right className="user-dd">
                                        <DropdownItem onClick={() => menuClickOptimize()}>
                                            Optimize
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickClear()}>
                                        Clear
                                        </DropdownItem>


                                        <DropdownItem onClick={() => menuClickDownloadSVG()}>
                                            Download
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickDownloadJPEG()}>
                                            Download JPEG
                                        </DropdownItem>
                                        <DropdownItem>
                                            Print
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickShowOptimizedBlank()}>
                                            Show Optimized Blank
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickShowAll()}>
                                            Show All
                                        </DropdownItem>


                                        <DropdownItem onClick={() => menuClickHideConstraints()}>
                                            Hide Constraints
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickShowConstraints()}>
                                            Show Constraints
                                        </DropdownItem>
                                        <DropdownItem onClick={() => menuClickRemoveConstraints()}>
                                            Remove Constraints
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                            
                        </div>
                    </CardTitle>
                    <CardBody>
                        <div className="stageContainer">
                            <div className="stageWrap" id="stageWrap">
                                <div className="downloadDoms" style={{display: 'none'}}>
                                    <a id="downloadLink" download />
                                    <canvas id="downloadCanvas" />
                                </div>
                                
                                <div 
                                    className="stageWrapContent" 
                                    id="stageWrapContent" 
                                    style={{cursor: btnHandActive ? 'move' : 'initial'}}
                                    draggable={btnHandActive}
                                    onClick={(e) => stageClick(e)} 
                                    onDrag={(e) => stageDrag(e)} 
                                    onDragStart={(e) => stageDragStart(e)}
                                    onDragEnd={(e) => stageDragEnd(e)}
                                >
                                    { UploadSvg({ svgText: svgFile, visible: !optimized, clear: clear }) }
                                    { DrawSvg({ constraints: constraints, constraintPoints: constraintPoints, eventPoints: eventPoints, visible: !optimized, clear: clear, hideConstraints: hideConstraints}) }
                                    { optimizeSVG({ constraints: constraints, visible: optimized, clear: clear, showOptimizedBlank: showOptimizedBlank}) }
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default WorkStage;